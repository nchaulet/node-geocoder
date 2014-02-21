(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleGeocoder = require('../../lib/geocoder/googlegeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {
          return {};
        }
    };

    describe('GoogleGeocoder', function() {

        describe('#constructor' , function() {
            it('an http adapter must be set', function() {
                expect(function() {new GoogleGeocoder();}).to.throw(Error, 'Google Geocoder need an httpAdapter');
            });

            it('if a clientId is specified an apiKey must be set', function() {
                expect(function() {new GoogleGeocoder(mockedHttpAdapter, {clientId: 'CLIENT_ID'});}).to.throw(Error, 'You must specify a apiKey (privateKey)');
            });

            it('Should be an instance of GoogleGeocoder if an http adapter is provided', function() {
                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.should.be.instanceof(GoogleGeocoder);
            });

            it('Should be an instance of GoogleGeocoder if an http adapter, clientId, and apiKer are provided', function() {
                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'CLIENT_ID', apiKey: 'API_KEY'});

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
                mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
                    address: "1 champs élysée Paris",
                    sensor: false
                }).once().returns({then: function() {}});

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysée Paris');

                mock.verify();
            });

            it('Should call httpAdapter get method with language if specified', function() {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
                    address: "1 champs élysée Paris",
                    sensor: false,
                    language: "fr"
                }).once().returns({then: function() {}});

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { language: 'fr' });

                googleAdapter.geocode('1 champs élysée Paris');

                mock.verify();
            });


            it('Should return geocoded adress', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
                        geometry: {location : {
                            lat: 37.386,
                            lng: -122.0838
                        }},
                        address_components: [
                            {types: ['country'], long_name: 'France', short_name: 'Fr' },
                            {types: ['locality'], long_name: 'Paris' },
                            {types: ['postal_code'], long_name: '75008' },
                            {types: ['route'], long_name: 'Champs-Élysées' },
                            {types: ['street_number'], long_name: '1' },
                            {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
                        ],
                        country_code: 'US',
                        country_name: 'United States',
                        locality: 'Mountain View',
                    }]}
                );
                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        "latitude"    : 37.386,
                        "longitude"   : -122.0838,
                        "country"     : "France",
                        "city"        : "Paris",
                        "zipcode"     : "75008",
                        "streetName"  : "Champs-Élysées",
                        "streetNumber": "1",
                        "countryCode" : "Fr",
                        "state"       : "Île-de-France",
                        "stateCode"   : "IDF"
                    });
                    mock.verify();
                    done();
                });
            });

            it('Should handle a not "OK" status', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
                    err.message.should.to.equal("Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.");
                    mock.verify();
                    done();
                });
            });

            it('Should handle a not "OK" status and no error_message', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "INVALID_REQUEST", results: [] });

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
                    err.message.should.to.equal("Status is INVALID_REQUEST.");
                    mock.verify();
                    done();
                });
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

            it('Should return geocoded adress', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
                        geometry: {location : {
                            lat: 40.714232,
                            lng: -73.9612889
                        }},
                        address_components: [
                            {types: ['country'], long_name: 'United States', short_name: 'US' },
                            {types: ['locality'], long_name: 'Brooklyn' },
                            {types: ['postal_code'], long_name: '11211' },
                            {types: ['route'], long_name: 'Bedford Avenue' },
                            {types: ['street_number'], long_name: '277' },
                            {types: ['administrative_area_level_1'], long_name: 'État de New York', short_name: 'NY'}


                        ],
                        country_code: 'US',
                        country_name: 'United States',
                        locality: 'Mountain View',
                    }]}
                );
                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);
                googleAdapter.reverse(40.714232,-73.9612889, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            "latitude"    : 40.714232,
                            "longitude"   : -73.9612889,
                            "country"     : "United States",
                            "city"        : "Brooklyn",
                            "zipcode"     : "11211",
                            "streetName"  : "Bedford Avenue",
                            "streetNumber": "277",
                            "countryCode" : "US",
                            "state"       : "État de New York",
                            "stateCode"   : "NY"
                        });
                        mock.verify();
                        done();
                });
            });

            it('Should handle a not "OK" status', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.reverse(40.714232,-73.9612889, function(err, results) {
                    err.message.should.to.equal("Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.");
                    mock.verify();
                    done();
                });
            });

            it('Should handle a not "OK" status and no error_message', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { status: "INVALID_REQUEST", results: [] });

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

                googleAdapter.reverse(40.714232,-73.9612889, function(err, results) {
                    err.message.should.to.equal("Status is INVALID_REQUEST.");
                    mock.verify();
                    done();
                });
            });

            it('Should call httpAdapter get method with signed url if clientId and apiKey specified', function() {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
                    address: "1 champs élysée Paris",
                    client: "raoul",
                    sensor: false,
                    signature: "wiN9RmtojePLkLpnDeamUtKVfjQ="
                }).once().returns({then: function() {}});

                var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'raoul', apiKey: 'foo'});

                googleAdapter.geocode('1 champs élysée Paris');

                mock.verify();
            });
        });


    });

})();
