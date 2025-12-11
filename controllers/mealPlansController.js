const mongoose = require('mongoose');
const MealPlan = require('../models/mealPlan');
const Recipe = require('../models/recipe');
const User = require('../models/user');

const REQUIRED_FIELDS = ['title', 'user', 'startDate', 'endDate', 'entries'];
const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const hasValue = (value) =>
  value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const validateEntries = (entries = []) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return 'entries must include at least one meal slot';
  }

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (!entry) {
      return `entries[${i}] is required`;
    }

    if (!entry.date || Number.isNaN(new Date(entry.date).getTime())) {
      return `entries[${i}].date is required and must be a valid date`;
    }

    if (!entry.mealType || !VALID_MEAL_TYPES.includes(entry.mealType)) {
      return `entries[${i}].mealType must be one of: ${VALID_MEAL_TYPES.join(', ')}`;
    }

    if (!entry.recipe) {
      return `entries[${i}].recipe is required`;
    }
  }

  return null;
};

const ensureRecipesExist = async (entries = []) => {
  const recipeIds = [...new Set(entries.map((entry) => entry.recipe).filter(Boolean))];

  if (recipeIds.some((id) => !mongoose.isValidObjectId(id))) {
    return { ok: false, status: 400, message: 'Invalid recipe id in entries' };
  }

  const foundCount = await Recipe.countDocuments({ _id: { $in: recipeIds } });
  if (foundCount !== recipeIds.length) {
    return { ok: false, status: 404, message: 'One or more recipe references were not found' };
  }

  return { ok: true };
};

const ensureUserExists = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    return { ok: false, status: 400, message: 'user must be a valid id' };
  }

  const exists = await User.exists({ _id: userId });
  if (!exists) {
    return { ok: false, status: 404, message: 'Referenced user not found' };
  }

  return { ok: true };
};

const getAll = async (req, res) => {
  try {
    const plans = await MealPlan.find()
      .populate('entries.recipe', 'title cuisine prepTimeMinutes cookTimeMinutes')
      .lean();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Failed to retrieve meal plans', error);
    res.status(500).json({ message: 'Unable to fetch meal plans' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid meal plan id' });
  }

  try {
    const plan = await MealPlan.findById(id).populate('entries.recipe', 'title cuisine').lean();

    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error(`Failed to retrieve meal plan with id ${id}`, error);
    res.status(500).json({ message: 'Unable to fetch meal plan' });
  }
};

const createMealPlan = async (req, res) => {
  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(400).json({ message: 'user must be a valid id' });
  }

  const entriesIssue = validateEntries(req.body.entries);
  if (entriesIssue) {
    return res.status(400).json({ message: entriesIssue });
  }

  const userCheck = await ensureUserExists(req.body.user);
  if (!userCheck.ok) {
    return res.status(userCheck.status).json({ message: userCheck.message });
  }

  const recipeCheck = await ensureRecipesExist(req.body.entries);
  if (!recipeCheck.ok) {
    return res.status(recipeCheck.status).json({ message: recipeCheck.message });
  }

  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: 'startDate and endDate must be valid dates' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'endDate must be on or after startDate' });
  }

  try {
    const payload = { ...req.body, user: req.body.user };
    const mealPlan = await MealPlan.create(payload);
    const populated = await mealPlan.populate('entries.recipe', 'title cuisine');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create meal plan', error);
    res.status(500).json({ message: 'Unable to create meal plan' });
  }
};

const updateMealPlan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid meal plan id' });
  }

  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(400).json({ message: 'user must be a valid id' });
  }

  const entriesIssue = validateEntries(req.body.entries);
  if (entriesIssue) {
    return res.status(400).json({ message: entriesIssue });
  }

  const userCheck = await ensureUserExists(req.body.user);
  if (!userCheck.ok) {
    return res.status(userCheck.status).json({ message: userCheck.message });
  }

  const recipeCheck = await ensureRecipesExist(req.body.entries);
  if (!recipeCheck.ok) {
    return res.status(recipeCheck.status).json({ message: recipeCheck.message });
  }

  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: 'startDate and endDate must be valid dates' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'endDate must be on or after startDate' });
  }

  try {
    const plan = await MealPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    plan.title = req.body.title;
    plan.user = req.body.user;
    plan.startDate = start;
    plan.endDate = end;
    plan.entries = req.body.entries;
    plan.notes = req.body.notes;

    const saved = await plan.save();
    const populated = await saved.populate('entries.recipe', 'title cuisine');
    res.status(200).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update meal plan with id ${id}`, error);
    res.status(500).json({ message: 'Unable to update meal plan' });
  }
};

const deleteMealPlan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid meal plan id' });
  }

  try {
    const plan = await MealPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    await plan.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete meal plan with id ${id}`, error);
    res.status(500).json({ message: 'Unable to delete meal plan' });
  }
};

module.exports = { getAll, getOne, createMealPlan, updateMealPlan, deleteMealPlan };
