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
  logger.error(error);

  // poner errores que me van saliendo de las diferentes request que hago en controller

  if (error.message.includes('to be unique')) {
    return response.status(400).json({ error: 'Usernames must be unique.' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'Malformatted user request' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(403).json({ error: 'invalid token, unauthorized.' });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization') || null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
