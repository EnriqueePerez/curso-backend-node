const boom = require('@hapi/boom');
const joi = require('joi');

function validate(data, schema) {
  const { error } = joi
    .object(schema)
    .validate(data, { errors: { stack: true } });
  return error;
}

function validationHandler(schema, check = 'body') {
  //checking req.body by default
  //Validate depending on the schema and the body
  return function (req, res, next) {
    //returning a middleware function to handle possible errors
    const error = validate(req[check], schema);

    error ? next(boom.badRequest(error)) : next(); //If error, sending to error middleware, if not, passing to the next middleware
  };
}

module.exports = validationHandler;
