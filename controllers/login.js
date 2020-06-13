const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const foundUser = await User.findOne({ username: body.username });

  const passwordCorrect =
    foundUser === null ? false : await bcrypt.compare(body.password, foundUser.passwordHash);

  if (!(passwordCorrect && foundUser)) {
    return response.status(401).json({
      error: 'Bad credentials',
    });
  }

  const userForToken = {
    username: foundUser.username,
    // eslint-disable-next-line no-underscore-dangle
    id: foundUser._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  return response.status(200).send({ token, username: foundUser.username, name: foundUser.name });
});

module.exports = loginRouter;
