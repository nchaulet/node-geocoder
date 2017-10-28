'use strict';
  var chai = require('chai');
  var should = chai.should();
  var assert = chai.assert;
  var sinon = require('sinon');

  var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');
  var HttpError = require('../../lib/error/httperror.js');

describe('HttpAdapter', () => {
  describe('#constructor' , () => {
    test('if no http specified must instanciate one', () => {
      var http = require('http');
      var httpAdapter = new HttpAdapter();

      assert.equal(httpAdapter.http, http);
    });

    test('if client specified must use it', () => {
      var mockedHttp = {'test' : 1};
      var httpAdapter = new HttpAdapter(mockedHttp);

      httpAdapter.http.should.equal(mockedHttp);
    });

    test('if client specified timeout use it', () => {
      var options = { timeout: 5 * 1000 };
      var httpAdapter = new HttpAdapter(null, options);

      httpAdapter.options.timeout.should.equal(options.timeout);
    });

  });

  describe('#get' , () => {
    test('get must call http  request', () => {
      var http = { request: function () {} };
      var mock = sinon.mock(http);
      mock.expects('request').once().returns({
          end: function() {},
          on: function() { return this; }
      });

      var httpAdapter = new HttpAdapter(http);

      httpAdapter.get('http://test.fr');

      mock.verify();
    });


    test('get must call http request with set options', () => {
      var http = { request: function () {} };
      var mock = sinon.mock(http);
      mock.expects('request')
      .withArgs({ headers: { "user-agent": "Bla blubber" }, host: "test.fr", path: "/?" })
      .once().returns({
          end: function() {},
          on: function() { return this; }
      });

      var httpAdapter = new HttpAdapter(http,
        {headers: {
          'user-agent': 'Bla blubber'
        }
      });

      httpAdapter.get('http://test.fr');

      mock.verify();
    });

    test('get must call http request with timeout', done => {
      var options = { timeout: 1 * 1000 };

      var httpAdapter = new HttpAdapter(null, options);

      httpAdapter.get('http://www.google.com', {}, function(err) {
        if(err instanceof HttpError && typeof err.code !== 'undefined') {
          err.code.should.equal('ETIMEDOUT');
        }

        done();
      });
    });
  });
});

