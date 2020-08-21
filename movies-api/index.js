const express = require('express');
const app = express();

const { config } = require('./config/index'); //getting the config for the development enviroment
const moviesApi = require('./routes/movies');

const {
  logErrors,
  errorHandler,
} = require('./utils/middlewares/errorHandlers'); //Adding error middlewares

// body parser
app.use(express.json());

moviesApi(app); //Using the movies routes in the app server

app.use(logErrors);
app.use(errorHandler); //Error middlewares must be at the end, after the routes

app.listen(config.port, function () {
  console.log(`Listening on http://localhost:${config.port}`);
});
