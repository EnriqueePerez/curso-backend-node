const express = require('express');
const app = express();

const { config } = require('./config/index'); //getting the config for the development enviroment
const moviesApi = require('./routes/movies');

const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middlewares/errorHandlers'); //Adding error middlewares
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

// body parser
app.use(express.json());

moviesApi(app); //Using the movies routes in the app server

// Catching a posible 404 errors
app.use(notFoundHandler);

//Error middlewares must be at the end, after the routes
app.use(logErrors); //sending error
app.use(wrapErrors); // managing if it is a boom error or not
app.use(errorHandler); //Sending the error to client

app.listen(config.port, function () {
  console.log(`Listening on http://localhost:${config.port}`);
});
