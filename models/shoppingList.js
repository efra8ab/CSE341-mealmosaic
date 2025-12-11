const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, min: 0 },
    unit: { type: String, trim: true },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const shoppingListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date },
    notes: { type: String, trim: true },
    items: {
      type: [itemSchema],
      validate: [(arr) => Array.isArray(arr) && arr.length > 0, 'At least one item is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
