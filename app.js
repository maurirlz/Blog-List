const config = require('./utils/config');
const express = require('express');

const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

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

app.use(middleware.requestLogger);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
