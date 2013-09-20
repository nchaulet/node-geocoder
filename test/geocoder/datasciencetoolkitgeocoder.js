(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var DataScienceToolkitGeocoder = require('../../lib/geocoder/datasciencetoolkitgeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('DataScienceToolkitGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new DataScienceToolkitGeocoder();}).to.throw(Error, 'DataScienceToolkitGeocoder need an httpAdapter');
            });

            it('Should be an instance of DataScienceToolkitGeocoder', function() {

                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);

                geocoder.should.be.instanceof(DataScienceToolkitGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept adress', function() {

                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);
                expect(function() {geocoder.geocode('1 rue test');})
                    .to
                    .throw(Error, 'DataScienceToolkitGeocoder suport only IPv4 geocoding');


            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);

                geocoder.geocode('127.0.0.1');

                mock.verify();
            });

            it('Should return a geocoded adress', function(done) {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                        '66.249.64.0' : {
                            latitude: 37.386,
                            longitude: -122.0838,
                            country_code: 'US',
                            country_name: 'United States',
                            locality: 'Mountain View',
                        }
                    }
                );
                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);

                geocoder.geocode('66.249.64.0', function(err, results) {
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        "latitude": 37.386,
                        "longitude": -122.0838,
                        "country": "United States",
                        "city": "Mountain View",
                        "zipcode": null,
                        "streetName": null,
                        "streetNumber": null,
                        "countryCode": "US"
                    });
                    mock.verify();
                    done();
                });

            });
        });

        describe('#reverse' , function() {
            it('Should throw an error', function() {
                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);
                expect(function() {geocoder.reverse(10.0235,-2.3662);})
                    .to
                    .throw(Error, 'DataScienceToolkitGeocoder no support reverse geocoding');

            });
        });


    });

})();