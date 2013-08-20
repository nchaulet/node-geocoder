(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleGeocoder = require('../../lib/geocoder/googlegeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

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

            it('Should return geocoded adress', function(done) {



                var googleAdapter = new GoogleGeocoder(new HttpAdapter());

                googleAdapter.geocode('1 champs élysée Paris', function(err, results) {
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        "latitude": 48.869261,
                        "longitude": 2.3091644,
                        "country": "France",
                        "city": "Paris",
                        "zipcode": "75008",
                        "streetName": "Champs-Élysées",
                        "streetNumber": "1",
                        "countryCode": "FR"
                    });

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
                var googleAdapter = new GoogleGeocoder(new HttpAdapter());
                googleAdapter.reverse(40.714232,-73.9612889, function(err, results) {
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

                        done();
                });
            });
        });


    });

})();
