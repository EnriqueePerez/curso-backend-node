const express = require('express');
const session = require('express-session');

const app = express();

app.use(
  session({
    resave: false, //Dont save the cookie when a change is made
    saveUninitialized: false, //If the cookie is not initialized, is not going to be saved
    secret: 'secretoSeguro', //When encrypted, this is the password that will use
  })
);

app.get('/', (req, res) => {
  req.session.count = req.session.count ? req.session.count + 1 : 1; //Adding sessions when the request is called
  res.status(200).json({ hello: 'world', counter: req.session.count });
});

app.listen(3000, () => {
  console.log('Listening http://localhost:3000');
});
