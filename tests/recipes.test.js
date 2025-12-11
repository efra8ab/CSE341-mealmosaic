process.env.AUTH_BYPASS = 'true';

const request = require('supertest');
const { app } = require('../app');
const Recipe = require('../models/recipe');
const { connectTestDb, disconnectDb, clearDatabase } = require('./testDb');

describe('Recipes GET endpoints', () => {
  let recipe;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    recipe = await Recipe.create({
      title: 'Test Tacos',
      cuisine: 'Mexican',
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      servings: 2,
      ingredients: [{ name: 'Tortillas', quantity: 4, unit: 'pieces' }],
      steps: ['Warm tortillas', 'Fill and serve'],
    });
  });

  test('GET /recipes returns a list of recipes', async () => {
    const res = await request(app).get('/recipes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test Tacos');
  });

  test('GET /recipes/:id returns a single recipe', async () => {
    const res = await request(app).get(`/recipes/${recipe._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(recipe._id.toString());
    expect(res.body.cuisine).toBe('Mexican');
  });
});
