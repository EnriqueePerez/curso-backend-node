const express = require('express');
const app = express();

const { config } = require('./config/index'); //getting the config for the development enviroment

app.get('/', function (req, res) {
  res.send('Hello world');
});

app.get('/json', function (req, res) {
  res.json({ Hello: 'world' });
});

app.listen(config.port, function () {
  console.log(`Listening on http://localhost:${config.port}`);
});
