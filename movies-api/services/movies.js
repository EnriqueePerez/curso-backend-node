const MongoLib = require('../lib/mongo');

//Creating the services of the movies
class MoviesService {
  //Adding the collection and mongo services
  constructor() {
    this.collection = 'movies';
    this.mongoDB = new MongoLib();
  }
  async getMovies({ tags }) {
    const query = tags && { tags: { $in: tags } }; //Structuring the query according to the db distribution
    const movies = await this.mongoDB.getAll(this.collection, query);
    return movies || []; //Returning the list of movies or and empty array
  }

  async getMovie({ movieId }) {
    const movie = await this.mongoDB.get(this.collection, movieId);
    return movie || {}; //Returning the movie or and empty object
  }

  async createMovie({ movie }) {
    const createMovieId = await this.mongoDB.create(this.collection, movie);
    return createMovieId;
  }

  async updateMovie({ movieId, movie } = {}) {
    //Setting to empty objects to avoid errors
    const updatedMovieId = await this.mongoDB.update(
      this.collection,
      movieId,
      movie
    );
    return updatedMovieId;
  }

  async deleteMovie({ movieId }) {
    const deteledMovieId = await this.mongoDB.delete(this.collection, movieId);
    return deteledMovieId;
  }
}

module.exports = MoviesService;
