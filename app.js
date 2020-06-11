const express = require('express');
const config = require('./utils/config');
require('express-async-errors');

const app = express();
// eslint-disable-next-line import/order
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

// eslint-disable-next-line import/order
const mongoose = require('mongoose');

logger.info('Connecting to: ', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error("Error, couldn't connect to MongoDB: ", err.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

app.use(middleware.requestLogger);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
