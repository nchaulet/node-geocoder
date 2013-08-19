(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleGeocoder = require('../../lib/geocoder/googlegeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('GoogleGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new GoogleGeocoder();}).to.throw(Error, 'Google Geocoder need an httpAdapter');
            });

            it('Should be an instance of GoogleGeocoder', function() {

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.should.be.instanceof(GoogleGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept Ipv4', function() {

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                expect(function() {
                        googleAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'Google Geocoder no suport geocoding ip');

            });

            it('Should not accept Ipv6', function() {

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                expect(function() {
                        googleAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'Google Geocoder no suport geocoding ip');

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

        });

        describe('#reverse' , function() {
            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.reverse(10.0235,-2.3662);

                mock.verify();

            });
        });


    });

})();