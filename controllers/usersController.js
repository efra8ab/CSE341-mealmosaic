const mongoose = require('mongoose');
const User = require('../models/user');

const REQUIRED_FIELDS = ['username', 'email'];

const hasValue = (value) =>
  value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getAll = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to retrieve users', error);
    res.status(500).json({ message: 'Unable to fetch users' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Failed to retrieve user with id ${id}`, error);
    res.status(500).json({ message: 'Unable to fetch user' });
  }
};

const createUser = async (req, res) => {
  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'email must be a valid email address' });
  }

  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      githubId: req.body.githubId,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'username or email already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create user', error);
    res.status(500).json({ message: 'Unable to create user' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const missing = missingRequired(req.body);
  if (missing.length) {
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'email must be a valid email address' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        username: req.body.username,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
        githubId: req.body.githubId,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'username or email already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update user with id ${id}`, error);
    res.status(500).json({ message: 'Unable to update user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete user with id ${id}`, error);
    res.status(500).json({ message: 'Unable to delete user' });
  }
};

module.exports = { getAll, getOne, createUser, updateUser, deleteUser };
