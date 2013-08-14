(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleAdapter = require('../../lib/geocoder/googleadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('GoogleAdapter', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new GoogleAdapter();}).to.throw(Error, 'GoogleAdapter need an httpAdapter');
            });

            it('Should be an instance of GoogleAdapter', function() {

                var googleAdapter = new GoogleAdapter(mockedHttpAdapter);

                googleAdapter.should.be.instanceof(GoogleAdapter);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept Ipv4', function(done) {

                var googleAdapter = new GoogleAdapter(mockedHttpAdapter);

                googleAdapter.geocode('127.0.0.1', function(err, res) {
                    err.should.be.instanceof(Error);
                    err.message.should.equal('Google adapter no suport geocoding ip');
                    done();
                });

            });

            it('Should not accept Ipv6', function(done) {

                var googleAdapter = new GoogleAdapter(mockedHttpAdapter);

                googleAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001', function(err, res) {
                    err.should.be.instanceof(Error);
                    err.message.should.equal('Google adapter no suport geocoding ip');
                    done();
                });

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var googleAdapter = new GoogleAdapter(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

        });


    });

})();