(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var DataScienceToolkitGeocoder = require('../../lib/geocoder/datasciencetoolkitgeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

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
                    .throw(Error, 'DataScienceToolkitGeocoder suport only ip geocoding');


            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var geocoder = new DataScienceToolkitGeocoder(mockedHttpAdapter);

                geocoder.geocode('127.0.0.1');

                mock.verify();
            });

            it('Should return a geocoded adress', function(done) {

                var geocoder = new DataScienceToolkitGeocoder(new HttpAdapter());

                geocoder.geocode('66.249.64.0', function(err, results) {
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        "latitude": 37.4192008972168,
                        "longitude": -122.057403564453,
                        "country": "United States",
                        "city": "Mountain View",
                        "zipcode": null,
                        "streetName": null,
                        "streetNumber": null,
                        "countryCode": "US"
                    });

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