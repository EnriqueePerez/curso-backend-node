const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib'); //getting the mock services

const { moviesMock } = require('../utils/mocks/movies'); //Getting the movies mock

//Testing the services
describe('services - movies', function () {
  const MoviesServices = proxyquire('../services/movies', {
    '../lib/mongo': MongoLibMock, //Replacing the real lib for the fake lib in the services
  });

  const moviesServices = new MoviesServices(); //Instancing the fake lib

  describe('when getMovies method is called', async function () {
    it('should call the getAll MongoLib method', async function () {
      await moviesServices.getMovies({});
      assert.deepStrictEqual(getAllStub.called, true); //Verifying that the method was called correctly
    });

    it('should return an array of movies', async function () {
      const result = await moviesServices.getMovies({});
      const expected = moviesMock;

      assert.deepStrictEqual(result, expected); //Verifying that we get the data
    });
  });
});
