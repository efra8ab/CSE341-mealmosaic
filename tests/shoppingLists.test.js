process.env.AUTH_BYPASS = 'true';

const request = require('supertest');
const { app } = require('../app');
const ShoppingList = require('../models/shoppingList');
const User = require('../models/user');
const { connectTestDb, disconnectDb, clearDatabase } = require('./testDb');

describe('Shopping Lists GET endpoints', () => {
  let list;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    const user = await User.create({ username: 'shopper', email: 'shopper@example.com' });
    list = await ShoppingList.create({
      title: 'Groceries',
      user: user._id,
      items: [
        { name: 'Beans', quantity: 2, unit: 'cans' },
        { name: 'Tortillas', quantity: 12, unit: 'pieces' },
      ],
      notes: 'Remember salsa',
    });
  });

  test('GET /shopping-lists returns shopping lists', async () => {
    const res = await request(app).get('/shopping-lists');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Groceries');
  });

  test('GET /shopping-lists/:id returns a single shopping list', async () => {
    const res = await request(app).get(`/shopping-lists/${list._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(list._id.toString());
    expect(res.body.items.length).toBe(2);
  });
});
