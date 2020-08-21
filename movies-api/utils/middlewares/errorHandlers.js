const boom = require('@hapi/boom');
const { config } = require('../../config/index');

function withErrorStack(error, stack) {
  if (config.dev === 'development') {
    //If in development mode, we are sending a full error with details
    return { ...error, stack }; //destructuring error because it has multiple values
  }

  return error; //if in production, just sending the message error without details
}

function logErrors(err, req, res, next) {
  console.log(err); //sending the error
  next(err); //passing the error to the next middleware
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    //If the error is not a boom type error, then pass 500 internal error status
    next(boom.badImplementation(err));
  }

  next(err); //If it is a boom error, pass to the error middlewares
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err; //Getting what we need from err body

  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack)); //Preparing the error depending on the enviroment
}

module.exports = { logErrors, wrapErrors, errorHandler };
