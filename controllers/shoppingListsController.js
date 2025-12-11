const mongoose = require('mongoose');
const ShoppingList = require('../models/shoppingList');
const User = require('../models/user');

const REQUIRED_FIELDS = ['title', 'user', 'items'];

const hasValue = (value) =>
  value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const validateItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'items must include at least one entry';
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item || !item.name || item.name.trim() === '') {
      return `items[${i}].name is required`;
    }
    if (item.quantity !== undefined && Number(item.quantity) < 0) {
      return `items[${i}].quantity must be zero or greater`;
    }
  }

  return null;
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
    const lists = await ShoppingList.find()
      .populate('user', 'username email')
      .lean();
    res.status(200).json(lists);
  } catch (error) {
    console.error('Failed to retrieve shopping lists', error);
    res.status(500).json({ message: 'Unable to fetch shopping lists' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid shopping list id' });
  }

  try {
    const list = await ShoppingList.findById(id).populate('user', 'username email').lean();
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    res.status(200).json(list);
  } catch (error) {
    console.error(`Failed to retrieve shopping list with id ${id}`, error);
    res.status(500).json({ message: 'Unable to fetch shopping list' });
  }
};

const createShoppingList = async (req, res) => {
  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const userCheck = await ensureUserExists(req.body.user);
  if (!userCheck.ok) {
    return res.status(userCheck.status).json({ message: userCheck.message });
  }

  const itemsIssue = validateItems(req.body.items);
  if (itemsIssue) {
    return res.status(400).json({ message: itemsIssue });
  }

  if (req.body.dueDate && Number.isNaN(new Date(req.body.dueDate).getTime())) {
    return res.status(400).json({ message: 'dueDate must be a valid date when provided' });
  }

  try {
    const list = await ShoppingList.create(req.body);
    const populated = await list.populate('user', 'username email');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create shopping list', error);
    res.status(500).json({ message: 'Unable to create shopping list' });
  }
};

const updateShoppingList = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid shopping list id' });
  }

  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const userCheck = await ensureUserExists(req.body.user);
  if (!userCheck.ok) {
    return res.status(userCheck.status).json({ message: userCheck.message });
  }

  const itemsIssue = validateItems(req.body.items);
  if (itemsIssue) {
    return res.status(400).json({ message: itemsIssue });
  }

  if (req.body.dueDate && Number.isNaN(new Date(req.body.dueDate).getTime())) {
    return res.status(400).json({ message: 'dueDate must be a valid date when provided' });
  }

  try {
    const updated = await ShoppingList.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        user: req.body.user,
        notes: req.body.notes,
        dueDate: req.body.dueDate,
        items: req.body.items,
      },
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!updated) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update shopping list with id ${id}`, error);
    res.status(500).json({ message: 'Unable to update shopping list' });
  }
};

const deleteShoppingList = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid shopping list id' });
  }

  try {
    const deleted = await ShoppingList.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete shopping list with id ${id}`, error);
    res.status(500).json({ message: 'Unable to delete shopping list' });
  }
};

module.exports = {
  getAll,
  getOne,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
};
