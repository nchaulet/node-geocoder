(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleGeocoder = require('../lib/geocoder/googlegeocoder.js');
    var GeocoderFactory = require('../lib/geocoderfactory.js');
    var DataScienceToolkitGeocoder = require('../lib/geocoder/datasciencetoolkitgeocoder.js');
    var OpenStreetMapGeocoder = require('../lib/geocoder/openstreetmapgeocoder.js');

    var RequestifyAdapter = require('../lib/httpadapter/requestifyadapter.js');
    var HttpAdapter = require('../lib/httpadapter/httpadapter.js');

    describe('GeocoderFactory', function() {

        describe('getGeocoder' , function() {
            it('called with "google" and "requestify" must return google geocoder with requestify adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'requestify');

                var geocoderAdapter = geocoder.geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(RequestifyAdapter);
            });

            it('called with "google" and "http" must return google geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'http');

                var geocoderAdapter = geocoder.geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "google" must return google geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google');

                var geocoderAdapter = geocoder.geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "datasciencetoolkit" and "http" must return datasciencetoolkit geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('datasciencetoolkit', 'http');

                var geocoderAdapter = geocoder.geocoder;

                geocoderAdapter.should.be.instanceof(DataScienceToolkitGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "openstreetmap" and "http" must return openstreetmap geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('openstreetmap', 'http');

                var geocoderAdapter = geocoder.geocoder;

                geocoderAdapter.should.be.instanceof(OpenStreetMapGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });
        });
    });

})();
