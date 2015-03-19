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

            it('Should not accept IPv4', function() {

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'OpenStreetMapGeocoder does not support geocoding IPv4');

            });

            it('Should not accept IPv6', function() {

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'OpenStreetMapGeocoder does not support geocoding IPv6');

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, [{
                        "place_id": "73723099",
                        "licence": "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
                        "osm_type": "way",
                        "osm_id": "90394480",
                        "boundingbox": ["52.5487473", "52.5488481", "-1.8165129", "-1.8163463"],
                        "lat": "52.5487921",
                        "lon": "-1.8164307339635",
                        "display_name": "135, Pilkington Avenue, Castle Vale, Maney, Birmingham, West Midlands, England, B72 1LH, United Kingdom",
                        "class": "building",
                        "type": "yes",
                        "importance": 0.411,
                        "address": {
                            "house_number": "135",
                            "road": "Pilkington Avenue",
                            "suburb": "Castle Vale",
                            "hamlet": "Maney",
                            "city": "Birmingham",
                            "state_district": "West Midlands",
                            "state": "England",
                            "postcode": "B72 1LH",
                            "country": "United Kingdom",
                            "country_code": "gb"
                        }
                    }]
                );

                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('135 pilkington avenue, birmingham', function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        "latitude": 52.5487921,
                        "longitude": -1.8164307339635,
                        "country": "United Kingdom",
						            "state": "England",
                        "city": "Birmingham",
                        "zipcode": "B72 1LH",
                        "streetName": "Pilkington Avenue",
                        "streetNumber": "135",
                        "countryCode": "GB"
                    });

                    done();
                });
            });

        });

        describe('#reverse' , function() {
            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                        "place_id": "119109484",
                        "licence": "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
                        "osm_type": "way",
                        "osm_id": "279767984",
                        "lat": "40.714205",
                        "lon": "-73.9613150927476",
                        "display_name": "279, Bedford Avenue, Williamsburg, Kings County, NYC, New York, 11211, United States of America",
                        "address": {
                            "house_number": "279",
                            "road": "Bedford Avenue",
                            "neighbourhood": "Williamsburg",
                            "county": "Kings County",
                            "city": "NYC",
                            "state": "New York",
                            "postcode": "11211",
                            "country": "United States of America",
                            "country_code": "us"
                        }
                    }
                );
                var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
                osmAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
                    mock.verify();
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        "latitude": 40.714205,
                        "longitude": -73.9613150927476,
                        "country": "United States of America",
                        "state": "New York",
                        "city": "NYC",
                        "zipcode": "11211",
                        "streetName": "Bedford Avenue",
                        "streetNumber": "279",
                        "countryCode": "US"
                    });
                    done();
                });
            });
        });
    });
})();
