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

    var GpxFormatter = require('../lib/formatter/gpxformatter.js');
    var StringFormatter = require('../lib/formatter/stringformatter.js');

    describe('GeocoderFactory', function() {

        describe('getGeocoder' , function() {
            it('called with "google" and "requestify" must return google geocoder with requestify adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'requestify');

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(RequestifyAdapter);
            });

            it('called with "google", "http" and extra business key must return google geocoder with http adapter and business key', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'http', {clientId: 'CLIENT_ID', apiKey: 'API_KEY'});

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.options.clientId.should.be.equal('CLIENT_ID');
                geocoderAdapter.options.apiKey.should.be.equal('API_KEY');
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "google", "http" and extra language key must return google geocoder with http adapter and options language', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'http', {language: 'fr'});

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.options.language.should.be.equal('fr');
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "google" and "http" and "gpx" must return google geocoder with http adapter and gpx formatter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'http', { formatter : 'gpx'});

                var geocoderAdapter = geocoder._geocoder;
                var formatter = geocoder._formatter;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
                formatter.should.be.instanceof(GpxFormatter);
            });

            it('called with "google" and "http" and "string" must return google geocoder with http adapter and string formatter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'http', { formatter : 'string', formatterPattern: 'PATTERN'});

                var geocoderAdapter = geocoder._geocoder;
                var formatter = geocoder._formatter;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
                formatter.should.be.instanceof(StringFormatter);
            });

            it('called with "google" must return google geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google');

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(GoogleGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "datasciencetoolkit" and "http" must return datasciencetoolkit geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('datasciencetoolkit', 'http');

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(DataScienceToolkitGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });

            it('called with "openstreetmap" and "http" must return openstreetmap geocoder with http adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('openstreetmap', 'http');

                var geocoderAdapter = geocoder._geocoder;

                geocoderAdapter.should.be.instanceof(OpenStreetMapGeocoder);
                geocoderAdapter.httpAdapter.should.be.instanceof(HttpAdapter);
            });
        });
    });

})();
