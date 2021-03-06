const express = require('express');
const MoviesService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middlewares/validationHandler');

function moviesApi(app) {
  const router = express.Router();

  app.use('/api/movies', router); //using the route /api/movies by default, like a prefix

  const moviesServices = new MoviesService(); //Creating a new class of the movies services to use

  router.get('/', async (req, res, next) => {
    const { tags } = req.query;
    try {
      const movies = await moviesServices.getMovies({ tags });

      res.status(200).json({
        data: movies,
        message: 'Movies listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'), //validating the movieId, from the params
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const movies = await moviesServices.getMovie({ movieId });

        res.status(200).json({
          data: movies,
          message: 'Movie retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    validationHandler(createMovieSchema), //validating the body of the post
    async (req, res, next) => {
      const { body: movie } = req; //extracting the movie from the body
      try {
        const createdMovieId = await moviesServices.createMovie({ movie });

        res.status(201).json({
          data: createdMovieId,
          message: 'Movie created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'), //validating the movieId, from the params
    validationHandler(updateMovieSchema), //validating the body of the update
    async (req, res, next) => {
      const { movieId } = req.params;
      const { body: movie } = req; //extracting the movie from the body
      try {
        const updatedMovieId = await moviesServices.updateMovie({
          movieId,
          movie,
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'Movie updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'), //validating the movieId, from the params
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await moviesServices.deleteMovie({ movieId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'Movie deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = moviesApi;
