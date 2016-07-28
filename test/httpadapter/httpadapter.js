'use strict';
(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon'),
        nock = require('nock');

    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');
    var HttpError = require('../../lib/error/httperror.js');

    describe('HttpAdapter', function() {

        describe('#constructor' , function() {

            it('if no http specified must instanciate one', function() {
                var http = require('http');

                var httpAdapter = new HttpAdapter();

                httpAdapter.http.should.equal(http);

            });

            it('if client specified must use it', function() {
                var mockedHttp = {'test' : 1};

                var httpAdapter = new HttpAdapter(mockedHttp);

                httpAdapter.http.should.equal(mockedHttp);
            });

            it('if client specified timeout use it', function() {
                var options = { timeout: 5 * 1000 };

                var httpAdapter = new HttpAdapter(null, options);

                httpAdapter.options.timeout.should.equal(options.timeout);
            });

        });

        describe('#get' , function() {

            it('get must call http  request', function() {
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


            it('get must call http request with set options', function() {
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

            it('get must call http request with timeout', function(done) {
                var options = { timeout: 5 * 1000 };

                this.timeout(options.timeout + 1000);

                var httpAdapter = new HttpAdapter(null, options);

                httpAdapter.get('http://www.google.com', {}, function(err) {
                  if(err instanceof HttpError && typeof err.code !== 'undefined') {
                    err.code.should.equal('ETIMEDOUT');
                  }

                  done();
                });
            });

            it('get must return error with raw response body', function(done){

                var responseBody = {
                    "error_message" : "Invalid request. Missing the 'address', 'bounds', 'components', 'latlng' or 'place_id' parameter.",
                    "results" : [],
                    "status" : "INVALID_REQUEST"
                };

                // mock request call
                nock('http://some.apis.com:80')
                    .get('/geocode')
                    .query({address: ''})
                    .reply(400, responseBody);


                var httpAdapter = new HttpAdapter(null);

                httpAdapter.get('https://some.apis.com/geocode', {address: ''}, function(err, result) {

                    expect(err).to.not.be.a('null');
                    expect(err).to.hasOwnProperty('message');
                    expect(err.message).to.be.equal('Response status code is 400');
                    expect(result).to.haveOwnProperty("error_message");
                    expect(result).to.haveOwnProperty("results");
                    expect(result).to.haveOwnProperty("status");
                    expect(result.status).to.be.equal("INVALID_REQUEST");

                    done();
                });

            });
        });

    });

})();
