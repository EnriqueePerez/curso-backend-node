const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    if (!req.user || (req.user && !req.user.scopes)) {
      //If user missing or scopes missing, then unauthorized
      next(boom.unauthorized('Missing Scopes'));
    }

    const hasAccess = allowedScopes
      .map((allowedScope) => req.user.scopes.includes(allowedScope))
      .find((allowed) => Boolean(allowed)); //Looking for the scopes in the user object and returning true or false
    if (hasAccess) {
      next(); //If scopes correct, then pass to the next middleware
    } else {
      next(boom.unauthorized('Insufficient Scopes')); //If scopes not found then send insufficient permissions
    }
  };
}

module.exports = scopesValidationHandler;
