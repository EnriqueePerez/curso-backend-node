const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies'); //requiring the dataMocks and the Mock service
const testServer = require('../utils/testServer'); //Requiring the test server

describe('route - movies,', function () {
  //Using mocha to prepare the test
  const route = proxyquire('../routes/movies', {
    //creating the main route to test ^
    '../services/movies': MoviesServiceMock, //Replacing the real service for the mock service, this is because we are just testing the routes, not the services
  });

  const request = testServer(route);
  describe('GET /movies', function () {
    //Preparing the first test ^
    it('should respond with status 200', function (done) {
      //it is part of mocha, it's helping us with the validations
      request.get('/api/movies').expect(200, done); //request is part of supertest, doing the request for us and getting what should be expected
    });

    it('should respond with the list of movies', function (done) {
      request.get('/api/movies').end((err, req) => {
        assert.deepStrictEqual(req.body, {
          data: moviesMock,
          message: 'Movies listed',
        });
      });

      done(); //if not called, an timeout error will appear
    });
  });
});
