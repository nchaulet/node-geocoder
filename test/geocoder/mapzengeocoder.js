(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var MapzenGeocoder = require('../../lib/geocoder/MapzenGeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('MapzenGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new MapzenGeocoder();}).to.throw(Error, 'MapzenGeocoder need an httpAdapter');
            });

            it('an apiKey must be set', function() {

                expect(function() {new MapzenGeocoder(mockedHttpAdapter);}).to.throw(Error, 'MapzenGeocoder needs an apiKey');
            });

            it('Should be an instance of MapzenGeocoder', function() {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                mapzenAdapter.should.be.instanceof(MapzenGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept IPv4', function() {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapzenAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'MapzenGeocoder does not support geocoding IPv4');

            });

            it('Should not accept IPv6', function() {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapzenAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'MapzenGeocoder does not support geocoding IPv6');

            });

            it('Should return a geocoded address', function(done) {

                var mapzenAdapter = new MapzenGeocoder(new HttpAdapter(), 'API_KEY');

                mapzenAdapter.geocode('2600 Clifton Ave, Cincinnati, OH 45220', function(err, results) {
                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        "latitude": 39.12968,
                        "longitude": -84.52065,
                        "country": "United States",
						            "state": "Ohio",
                        "city": "Cincinnati",
                        "zipcode": null,
                        "streetName": "Clifton Avenue",
                        "streetNumber": "2600",
                        "countryCode": "USA",
                        "extra": {
                          "confidence": 0.7000000000000001
                        }
                    });

                    done();
                });

            });

        });

        describe('#reverse' , function() {
            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                mapzenAdapter.reverse({lat:10.0235,lon:-2.3662});

                mock.verify();
            });

        });


    });

})();
