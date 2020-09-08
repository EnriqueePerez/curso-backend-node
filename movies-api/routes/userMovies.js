const express = require('express');

//Services and validations handler
const UserMoviesServices = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');

//Schemas
// const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');
// const { createUserSchema } = require('../utils/schemas/userMovies');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router); //Using a route prefix

  const userMoviesService = new UserMoviesServices();

  router.get(
    '/',
    validationHandler({ userId: userIdSchema }, 'query'), //Verifying the userId which is in the query
    async (req, res, next) => {
      const { userId } = req;
      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: 'user movies listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = userMoviesApi;
