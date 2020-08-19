const express = require('express');
const app = express();

const { config } = require('./config/index'); //getting the config for the development enviroment
const moviesApi = require('./routes/movies');

moviesApi(app); //Using the movies routes in the app server

app.listen(config.port, function () {
  console.log(`Listening on http://localhost:${config.port}`);
});
