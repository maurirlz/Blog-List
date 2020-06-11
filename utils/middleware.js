const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method);
  logger.info('Path: ', request.path);
  logger.info('Body: ', request.body);
  logger.info('Code of response: ', response.statusCode);
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  // poner errores que me van saliendo de las diferentes request que hago en controller

  if (error.message.includes('to be unique')) {
    return response.status(400).json({ error: 'Usernames must be unique.' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'Malformatted user request' });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
