const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UserService = require('../../../services/users');
const { config } = require('../../../config');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Geting the JWT from the Token header
    },
    async (tokenPayload, done) => {
      const usersService = new UserService();

      try {
        const user = await usersService.getUser({ email: tokenPayload.email });

        if (!user) {
          return done(boom.unauthorized(), false);
        }

        delete user.password;

        done(null, { ...user, scopes: tokenPayload.scopes }); //returning the user and the scope
      } catch (err) {
        return done(err);
      }
    }
  )
);
