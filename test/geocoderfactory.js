(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var GoogleGeocoder = require('../lib/geocoder/googlegeocoder.js');
    var GeocoderFactory = require('../lib/geocoderfactory.js');

    var RequestifyAdapter = require('../lib/httpadapter/requestifyadapter.js');

    describe('GeocoderFactory', function() {

        describe('getGeocoder' , function() {
            it('called with "google" and "requestify" must return google geocoder with requestify adapter', function() {
                var geocoder = GeocoderFactory.getGeocoder('google', 'requestify');

                geocoder.should.be.instanceof(GoogleGeocoder);
                geocoder.httpAdapter.should.be.instanceof(RequestifyAdapter);
            });
        });
    });

})();