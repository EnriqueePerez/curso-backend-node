const boom = require('@hapi/boom');

function validate() {}

function validationHandler(schema, check = 'body') {
  //Validate depending on the schema and the body
  return function (req, res, next) {
    //returning a middleware function to handle possible errors
    const error = validate(req[check], schema);

    error ? next(boom.badRequest(error)) : next(); //If error, sending to error middleware, if not, passing to the next middleware
  };
}

module.exports = validationHandler;
