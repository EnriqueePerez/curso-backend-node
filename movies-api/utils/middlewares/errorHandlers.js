const { config } = require('../../config/index');

function withErrorStack(error, stack) {
  if (config.dev === 'development') {
    //If in development mode, we are sending a full error with details
    return { error, stack };
  }

  return error; //if in production, just sending the message error without details
}

function logErrors(err, req, res, next) {
  console.log(err); //sending the error
  next(err); //passing the error to the next middleware
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.status(err.status || 500); //when an error happens, sending 500 in status
  res.json(withErrorStack(err.message, err.stack)); //Preparing the error depending on the enviroment
}

module.exports = { logErrors, errorHandler };
