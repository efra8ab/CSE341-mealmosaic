process.env.AUTH_BYPASS = 'true';

const request = require('supertest');
const { app } = require('../app');
const User = require('../models/user');
const { connectTestDb, disconnectDb, clearDatabase } = require('./testDb');

describe('Users GET endpoints', () => {
  let user;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ username: 'reader', email: 'reader@example.com' });
  });

  test('GET /users returns a list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].username).toBe('reader');
  });

  test('GET /users/:id returns a single user', async () => {
    const res = await request(app).get(`/users/${user._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(user._id.toString());
    expect(res.body.email).toBe('reader@example.com');
  });
});
