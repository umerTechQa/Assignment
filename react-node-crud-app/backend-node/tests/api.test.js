// tests/api.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // 

describe('User API tests', () => {
  let createdUserId;

  // Connect to DB before tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // Disconnect DB after all tests
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /api/users - Add new user', async () => {
    const newUser = {
      name: 'Umer',
      email: 'umertest@example.com',
      age: 31,
    };

    const res = await request(app).post('/api/users').send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
    createdUserId = res.body._id;
  });

  test('GET /api/users - get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/:id - single user', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdUserId);
  });

  test('PUT /api/users/:id - update user', async () => {
    const updatedData = {
      name: 'Umer Updated',
      email: 'updated@example.com',
      age: 30,
    };

    const res = await request(app).put(`/api/users/${createdUserId}`).send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.email).toBe(updatedData.email);
  });

  test('DELETE /api/users/:id - delete user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('GET /api/users/:id - get deleted user returns 404', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('POST /api/users - should fail when required fields are missing', async () => {
    const res = await request(app).post('/api/users').send({ name: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toBeDefined();
  });

  test('DELETE /api/users/:id - should return 400 for invalid ObjectId format', async () => {
    const res = await request(app).delete('/api/users/invalid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });
});