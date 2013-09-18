(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var OpenStreetMapGeocoder = require('../../lib/geocoder/openstreetmapgeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('OpenStreetMapGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new OpenStreetMapGeocoder();}).to.throw(Error, 'OpenStreetMapGeocoder need an httpAdapter');
            });

            it('Should be an instance of OpenStreetMapGeocoder', function() {

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                osmAdapter.should.be.instanceof(OpenStreetMapGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept Ipv4', function() {

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'OpenStreetMapGeocoder no suport geocoding ip');

            });

            it('Should not accept Ipv6', function() {

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'OpenStreetMapGeocoder no suport geocoding ip');

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

            it('Should return geocoded adress', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, [{
                        lat: 48.86841815,
                        lon: 2.30700964746136,
                        address: {
                            country_code: 'FR',
                            country: 'France',
                            city: 'Paris',
                            postcode: "75008",
                            road: 'Champs-Élysées',
                            house_number: "1"
                        }
                    }]
                );

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('1 champ-élysées Paris', function(err, results) {
                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        "latitude": 48.86841815,
                        "longitude": 2.30700964746136,
                        "country": "France",
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
            it('Should return geocoded adress', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, [{
                        lat: 40.714232,
                        lon: -73.9612889,
                        address: {
                            country_code: 'US',
                            country: 'United States',
                            city: 'Brooklyn',
                            postcode: "11211",
                            road: 'Bedford Avenue',
                            house_number: "277"
                        }
                    }]
                );
                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
                osmAdapter.reverse(40.714232,-73.9612889, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            "latitude": 40.714232,
                            "longitude": -73.9612889,
                            "country": "United States",
                            "city": "Brooklyn",
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
