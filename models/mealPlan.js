const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    mealType: { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    entries: {
      type: [mealEntrySchema],
      validate: [(arr) => arr.length > 0, 'At least one meal entry is required'],
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

mealPlanSchema.pre('validate', function ensureDateOrder() {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'endDate must be on or after startDate');
  }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
