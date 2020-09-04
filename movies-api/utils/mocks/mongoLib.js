const sinon = require('sinon');

const { moviesMock, filteredMoviesMocks } = require('./movies'); //Getting the mock data

const getAllStub = sinon.stub(); //Creating getall Stub
getAllStub.withArgs('movies').resolves(moviesMock); //When the stub is called with movies, we will resolve with mock movies

const tagQuery = { tags: { $in: ['Drama'] } };
getAllStub.withArgs('movies', tagQuery).resolves(filteredMoviesMocks('Drama')); //When calling the stub with tags, resolving with the filteredMovies

const createStub = sinon.stub().resolves(moviesMock[0].id); //Creating the createStub, with this, no args are required, therefore, when called, resolving with the movie id

class MongoLibMock {
  //Creating the mongolibmock
  getAll(collection, query) {
    return getAllStub(collection, query);
  }

  create(collection, data) {
    return createStub(collection, data);
  }
}

module.exports = {
  getAllStub,
  createStub,
  MongoLibMock,
};
