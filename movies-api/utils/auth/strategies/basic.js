const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UserService = require('../../../services/users');

passport.use(
  new BasicStrategy(async (email, password, done) => {
    const userServices = new UserService();

    try {
      const user = await userServices.getUser({ email });

      if (!user) {
        return done(boom.unauthorized(), false); //Returning an 401 and saying that the user doesnt exists
      }
      if (!(await bcrypt.compare(password, user.password))) {
        //Comparing the password introduce with the one we have in the db
        return done(boom.unauthorized(), false);
      }

      delete user.password; //Deleting the user password for security purposes

      done(null, user); //While the validations are being make, returning a null error;
      return;
    } catch (err) {
      return done(err);
    }
  })
);
