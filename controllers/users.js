const userRouter = require('express').Router();
// eslint-disable-next-line new-cap,no-new-require
const bcrypt = require('bcrypt');
// eslint-disable-next-line new-cap,no-new-require
const User = require('../models/user');
// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger');

userRouter.get('/', async (request, response) => {
  const returnedUsers = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  // eslint-disable-next-line no-undef
  response.json(returnedUsers.map((user) => user.toJSON()));
});

userRouter.post('/', async (request, response, next) => {
  const { body } = request;

  if (!body || body.password.length <= 3) {
    response.status(400).end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

userRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await User.findByIdAndRemove(id);

  response.status(204).end();
});

module.exports = userRouter;
