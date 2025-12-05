const mongoose = require('mongoose');
const Recipe = require('../models/recipe');

const REQUIRED_FIELDS = ['title', 'cuisine', 'prepTimeMinutes', 'cookTimeMinutes', 'servings', 'ingredients', 'steps'];
const hasValue = (value) =>
  value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const validateNumbers = (payload = {}) => {
  const invalid = [];
  if (payload.prepTimeMinutes !== undefined && Number(payload.prepTimeMinutes) < 0) invalid.push('prepTimeMinutes');
  if (payload.cookTimeMinutes !== undefined && Number(payload.cookTimeMinutes) < 0) invalid.push('cookTimeMinutes');
  if (payload.servings !== undefined && Number(payload.servings) < 1) invalid.push('servings');
  return invalid;
};

const validateIngredients = (ingredients = []) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return 'ingredients must include at least one item';
  }

  const missingName = ingredients.some((item) => !item || !item.name || item.name.trim() === '');
  if (missingName) {
    return 'each ingredient requires a name';
  }

  return null;
};

const validateSteps = (steps = []) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return 'steps must include at least one item';
  }

  const emptyStep = steps.some((step) => !step || String(step).trim() === '');
  if (emptyStep) {
    return 'steps cannot be empty';
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Failed to retrieve recipes', error);
    res.status(500).json({ message: 'Unable to fetch recipes' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }

  try {
    const recipe = await Recipe.findById(id).lean();

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(`Failed to retrieve recipe with id ${id}`, error);
    res.status(500).json({ message: 'Unable to fetch recipe' });
  }
};

const createRecipe = async (req, res) => {
  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const numberIssues = validateNumbers(req.body);
  if (numberIssues.length) {
    return res.status(400).json({ message: 'Numeric fields are invalid', invalidFields: numberIssues });
  }

  const ingredientsIssue = validateIngredients(req.body.ingredients);
  if (ingredientsIssue) {
    return res.status(400).json({ message: ingredientsIssue });
  }

  const stepsIssue = validateSteps(req.body.steps);
  if (stepsIssue) {
    return res.status(400).json({ message: stepsIssue });
  }

  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create recipe', error);
    res.status(500).json({ message: 'Unable to create recipe' });
  }
};

const updateRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }

  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const numberIssues = validateNumbers(req.body);
  if (numberIssues.length) {
    return res.status(400).json({ message: 'Numeric fields are invalid', invalidFields: numberIssues });
  }

  const ingredientsIssue = validateIngredients(req.body.ingredients);
  if (ingredientsIssue) {
    return res.status(400).json({ message: ingredientsIssue });
  }

  const stepsIssue = validateSteps(req.body.steps);
  if (stepsIssue) {
    return res.status(400).json({ message: stepsIssue });
  }

  try {
    const updated = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update recipe with id ${id}`, error);
    res.status(500).json({ message: 'Unable to update recipe' });
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }

  try {
    const deleted = await Recipe.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete recipe with id ${id}`, error);
    res.status(500).json({ message: 'Unable to delete recipe' });
  }
};

module.exports = { getAll, getOne, createRecipe, updateRecipe, deleteRecipe };
