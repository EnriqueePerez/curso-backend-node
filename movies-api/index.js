const express = require('express');
const cors = require('cors');
const app = express();

const { config } = require('./config/index'); //getting the config for the development enviroment
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');

const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middlewares/errorHandlers'); //Adding error middlewares
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

app.use(cors());

// body parser
app.use(express.json());

//routes
moviesApi(app);
userMoviesApi(app);

// Catching a posible 404 errors
app.use(notFoundHandler);

//Error middlewares must be at the end, after the routes
app.use(logErrors); //log error on console
app.use(wrapErrors); // managing if it is a boom error or not
app.use(errorHandler); //Sending the error to client

app.listen(config.port, function () {
  console.log(`Listening on http://localhost:${config.port}`);
});
