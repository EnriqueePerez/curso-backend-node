const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const { config } = require('./config');

const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());

//Basic Strategy
require('./utils/auth/strategies/basic');

// OAuth Strategy
require('./utils/auth/strategies/oauth');

app.post('/auth/sign-in', async function (req, res, next) {
  passport.authenticate('basic', function (error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error);
        }

        const { token, user } = data;

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async function (req, res, next) {
  const { body: user } = req.body;

  try {
    await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: user,
    });

    res.status(201).json({
      message: 'user created',
    });
  } catch (err) {
    next(err);
  }
});

app.get('/movies', async function (req, res, next) {});

app.post('/user-movies', async function (req, res, next) {
  try {
    const { body: userMovie } = req;
    const { token } = req.cookies; //Getting the token from the cookies

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` }, //Sending the token in the header
      method: 'post',
      data: userMovie,
    });
    console.log('todo bien hasta aqui');

    console.log(status, 'aqui esta el estado');

    if (status !== 200) {
      //If something bad happen, send error
      return next(boom.badImplementation('paso algo feo'));
    }

    res.status(201).json(data); //Returning the data to the SPA
  } catch (err) {
    next(err);
  }
});

app.delete('/user-movies/:userMovieId', async function (req, res, next) {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies; //Getting the token from the cookies

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` }, //Sending the token in the header
      method: 'delete',
    });

    if (status !== 200) {
      //If something bad happen, send error
      next(boom.badImplementation());
    }

    res.status(200).json(data); //Returning the data to the SPA
  } catch (err) {
    next(err);
  }
});

//Route to auth with google
app.get(
  '/auth/google-oauth',
  passport.authenticate('google-oauth', {
    scope: ['email', 'profile', 'openid'],
  })
);

//Route to redirect after signing in with google
app.get(
  '/auth/google-oauth/callback',
  passport.authenticate('google-oauth', { session: false }),
  function (req, res, next) {
    //Looking for a user
    if (!req.user) {
      next(boom.unauthorized());
    }

    //Getting the token and the user info
    const { token, ...user } = req.user;

    //Putting the token in a cookie
    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
    });

    //Sending the user to verify that everything is right
    res.status(200).json(user);
  }
);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
