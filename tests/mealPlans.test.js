process.env.AUTH_BYPASS = 'true';

const request = require('supertest');
const { app } = require('../app');
const MealPlan = require('../models/mealPlan');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const { connectTestDb, disconnectDb, clearDatabase } = require('./testDb');

describe('Meal Plans GET endpoints', () => {
  let mealPlan;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    const user = await User.create({ username: 'planner', email: 'planner@example.com' });
    const recipe = await Recipe.create({
      title: 'Plan Recipe',
      cuisine: 'Fusion',
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      servings: 1,
      ingredients: [{ name: 'Rice', quantity: 1, unit: 'cup' }],
      steps: ['Cook rice'],
    });

    mealPlan = await MealPlan.create({
      title: 'Week Plan',
      user: user._id,
      startDate: '2024-05-01',
      endDate: '2024-05-02',
      entries: [
        { date: '2024-05-01', mealType: 'dinner', recipe: recipe._id, notes: 'First night' },
      ],
    });
  });

  test('GET /meal-plans returns meal plans with entries', async () => {
    const res = await request(app).get('/meal-plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].entries.length).toBeGreaterThan(0);
  });

  test('GET /meal-plans/:id returns a single meal plan', async () => {
    const res = await request(app).get(`/meal-plans/${mealPlan._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(mealPlan._id.toString());
    expect(res.body.title).toBe('Week Plan');
  });
});
