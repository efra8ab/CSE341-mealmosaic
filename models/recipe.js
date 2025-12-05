const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, min: 0 },
    unit: { type: String, trim: true },
  },
  { _id: false }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },
    prepTimeMinutes: { type: Number, required: true, min: 0 },
    cookTimeMinutes: { type: Number, required: true, min: 0 },
    servings: { type: Number, required: true, min: 1 },
    ingredients: {
      type: [ingredientSchema],
      required: true,
      validate: [(arr) => arr.length > 0, 'At least one ingredient is required'],
    },
    steps: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length > 0, 'At least one step is required'],
    },
    tags: { type: [String], default: [] },
    nutrition: nutritionSchema,
    author: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
