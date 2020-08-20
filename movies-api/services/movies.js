const { moviesMock } = require('../utils/mocks/movies');

//Creating the services of the movies
class MoviesService {
  async getMovies() {
    const movies = await Promise.resolve(moviesMock);
    return movies || []; //Returning the list of movies or and empty array
  }

  async getMovie() {
    const movie = await Promise.resolve(moviesMock[0]);
    return movie || {}; //Returning the movie or and empty object
  }

  async createMovie() {
    const createMovieId = await Promise.resolve(moviesMock[0]);
    return createMovieId;
  }

  async updateMovie() {
    const updatedMovieId = await Promise.resolve(moviesMock[0]);
    return updatedMovieId;
  }

  async deleteMovie() {
    const deteledMovieId = await Promise.resolve(moviesMock[0]);
    return deteledMovieId;
  }
}

module.exports = MoviesService;
