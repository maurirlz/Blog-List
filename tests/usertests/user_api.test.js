const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const logger = require('../../utils/logger');
const helper = require('./user_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  logger.info('cleared users');

  const users = helper.initialUsers.map((user) => new User(user));
  const promises = users.map((user) => user.save());

  await Promise.all(promises);
});

describe('Users in database', () => {
  test('Users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('When sending an user, it is properly saved in the database', async () => {
    const { initialUsers } = helper;

    const newUser = {
      username: 'fabriziorlz',
      name: 'Fabricio',
      password: 'test',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resultingUsers = await helper.getUsersInDatabase();

    logger.info(resultingUsers);

    expect(resultingUsers).toHaveLength(initialUsers.length + 1);
  });

  test('When sending a malformed user, the status code returned is 400 Bad Request', async () => {
    const malformedUser = {
      name: 'Fabricio',
      password: 'test',
    };

    await api.post('/api/users').send(malformedUser).expect(400);
  });

  test('When sending a invalid password, the status code returned is 400 Bad Request', async () => {
    const invalidPasswordUser = {
      name: 'Fabricio',
      username: 'fabrirlz',
      password: '1t',
    };

    await api.post('/api/users').send(invalidPasswordUser).expect(400);
  });

  test('When sending an already existing username, server returns 400 bad request.', async () => {
    const newUser = {
      username: 'maurirlz',
      name: 'mauri',
      password: 'test',
    };

    api.post('/api/users').send(newUser).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
