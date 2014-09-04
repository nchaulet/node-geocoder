(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var NominatimMapquestGeocoder = require('../../lib/geocoder/nominatimmapquestgeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('NominatimMapquestGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new NominatimMapquestGeocoder();}).to.throw(Error, 'NominatimMapquestGeocoder need an httpAdapter');
            });

            it('Should be an instance of NominatimMapquestGeocoder', function() {

                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);

                nmAdapter.should.be.instanceof(NominatimMapquestGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept IPv4', function() {

                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);

                expect(function() {
                        nmAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'NominatimMapquestGeocoder does not support geocoding IPv4');

            });

            it('Should not accept IPv6', function() {

                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);

                expect(function() {
                        nmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'NominatimMapquestGeocoder does not support geocoding IPv6');

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);

                nmAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                        lat: 48.86841815,
                        lon: 2.30700964746136,
                        address: {
                            country_code: 'FR',
                            country: 'France',
							state: 'Ile-de-France',
                            city: 'Paris',
                            postcode: "75008",
                            road: 'Champs-Élysées',
                            house_number: "1"
                        }
                    }
                );

                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);

                nmAdapter.geocode('1 champ-élysées Paris', function(err, results) {
                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        "latitude": 48.86841815,
                        "longitude": 2.30700964746136,
                        "country": "France",
						"state": "Ile-de-France",
                        "city": "Paris",
                        "zipcode": "75008",
                        "streetName": "Champs-Élysées",
                        "streetNumber": "1",
                        "countryCode": "FR"
                    });

                    mock.verify();
                    done();
                });
            });

        });

        describe('#reverse' , function() {
            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                        lat: 40.714232,
                        lon: -73.9612889,
                        address: {
                            country_code: 'US',
                            country: 'United States',
                            city: 'Brooklyn',
							state: 'New York',
                            postcode: "11211",
                            road: 'Bedford Avenue',
                            house_number: "277"
                        }
                    }
                );
                var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter);
                nmAdapter.reverse(40.714232,-73.9612889, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            "latitude": 40.714232,
                            "longitude": -73.9612889,
                            "country": "United States",
                            "city": "Brooklyn",
							"state": "New York",
                            "zipcode": "11211",
                            "streetName": "Bedford Avenue",
                            "streetNumber": "277",
                            "countryCode": "US"
                        });
                        mock.verify();
                        done();
                });
            });
        });
    });
})();
