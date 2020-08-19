const express = require('express');
const app = express();

const { config } = require('./config/index');

app.get('/:year', (req, res) => {
  const isLeap = new Promise((resolve, reject) => {
    const year = req.params.year;
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        if (year % 400 === 0) {
          leap();
        } else notLeap();
      } else leap();
    } else notLeap();

    function notLeap() {
      reject('No es bisiesto');
    }
    function leap() {
      resolve('Es bisiesto');
    }
  });

  isLeap
    .then((resolve) => res.send(resolve))
    .catch((reject) => res.send(reject));
});

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
