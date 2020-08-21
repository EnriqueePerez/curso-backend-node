const boom = require('@hapi/boom');

function notFoundHandler(req, res) {
  const {
    output: { statusCode, payload },
  } = boom.notFound(); //Getting what we need from 404 boom error

  res.status(statusCode).json(payload);
}

module.exports = notFoundHandler;
