const passport = require('passport');
const axios = require('axios');
const boom = require('@hapi/boom');
const { OAuth2Strategy } = require('passport-oauth');

const { config } = require('../../../config');

//Required for auth with google (can be found on the documentation)
const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_URSERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const oAuth2Strategy = new OAuth2Strategy(
  {
    authorizationURL: GOOGLE_AUTHORIZATION_URL,
    tokenURL: GOOGLE_TOKEN_URL,
    clientID: config.googleClientId, //Get it from console.developers.google.com
    clientSecret: config.googleClientSecret, //Get it from console.developers.google.com
    callbackURL: '/auth/google-oauth/callback', //Setting the redirect page to auth with google
  },
  async function (accessToken, refreshToken, profile, done) {
    //all the params that the function use are important
    const { data, status } = await axios({
      //Sending data that we got from google and creating a new user or just signin in
      url: `${config.apiUrl}/api/auth/sign-provider`,
      method: 'post',
      data: {
        name: profile.name,
        email: profile.email,
        password: profile.id,
        apiKeyToken: config.apiKeyToken,
      },
    });

    //If something happen when doing the request
    if (!data || status !== 200) {
      return done(boom.unauthorized(), false);
    }

    //If there is not problem
    return done(null, data);
  }
);

//Getting the profile info from google
oAuth2Strategy.userProfile = function (accessToken, done) {
  this._oauth2.get(GOOGLE_URSERINFO_URL, accessToken, (err, body) => {
    if (err) {
      return done(err);
    }

    try {
      const { sub, name, email } = JSON.parse(body); //Getting the require data from the body

      const profile = {
        id: sub,
        name,
        email,
      };

      done(null, profile);
    } catch (parseError) {
      return done(parseError);
    }
  });
};

//Setting the strategy to use
passport.use('google-oauth', oAuth2Strategy);
