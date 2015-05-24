(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GeocodioGeocoder = require('../../lib/geocoder/geocodiogeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('GeocodioGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new GeocodioGeocoder();}).to.throw(Error, 'GeocodioGeocoder need an httpAdapter');
            });

            it('an apiKey must be set', function() {

                expect(function() {new GeocodioGeocoder(mockedHttpAdapter);}).to.throw(Error, 'GeocodioGeocoder needs an apiKey');
            });

            it('Should be an instance of GeocodioGeocoder', function() {

                var mapquestAdapter = new GeocodioGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.should.be.instanceof(GeocodioGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept IPv4', function() {

                var mapquestAdapter = new GeocodioGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'GeocodioGeocoder does not support geocoding IPv4');

            });

            it('Should not accept IPv6', function() {

                var mapquestAdapter = new GeocodioGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'GeocodioGeocoder does not support geocoding IPv6');

            });

        });

        describe('#reverse' , function() {
            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var mapquestAdapter = new GeocodioGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.reverse({lat:10.0235,lon:-2.3662});

                mock.verify();
            });

        });


    });

})();
