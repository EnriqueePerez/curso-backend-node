const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const UserService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');

const {
  createUserSchema,
  createProviderUserSchema,
} = require('../utils/schemas/users');

const { config } = require('../config');

//Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeysService = new ApiKeysService();
  const userService = new UserService();

  router.post('/sign-in', async (req, res, next) => {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      //If is not authorized, send an error
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) {
          //If error or not user, send error
          next(boom.unauthorized('No pase'));
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m',
          });

          res.status(200).json({ token, user: { id, name, email } });
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  });

  router.post(
    '/sign-up',
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;

      try {
        const userExists = await userService.verifyUserExists(user);

        if (userExists) {
          res.status(409).json({ message: 'user already exists' });
        } else {
          const createdUserId = await userService.createUser({ user });

          res.status(201).json({
            data: createdUserId,
            message: 'user created',
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  //Route use to sign in with third parties
  router.post(
    '/sign-provider',
    validationHandler(createProviderUserSchema), //Using the third party userSchema
    async function (req, res, next) {
      const { body } = req; //Getting the body

      const { apiKeyToken, ...user } = body; //Getting the apiKeyToken

      //If apiKeyToken missing, send error
      if (!apiKeyToken) {
        next(boom.unauthorized('apiKeyToken is required'));
      }

      try {
        //Getting the user or creating it
        const queriedUser = await userService.getOrCreateUser({ user });
        //Getting the apiKey from the db, it can be with public or admin permissions
        const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

        //If the apiKeyToken is wrong or missing;
        if (!apiKey) {
          next(boom.unauthorized());
        }

        //Getting the required data from the queriedUser
        const { _id: id, name, email } = queriedUser;

        //Preparing the payload
        const payload = {
          sub: id,
          name,
          email,
          scopes: apiKey.scopes,
        };

        //Signing the token with the secret key
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '15m',
        });

        return res.status(200).json({ token, user: { id, name, email } });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = authApi;
