(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect;

    var GpxFormatter = require('../../lib/formatter/gpxformatter.js');

    describe('GpxFormatter', function() {

        describe('#format' , function() {
            it('should format using gpx format', function() {
                var formatter = new GpxFormatter();

                var results = formatter.format([{
                    latitude: 40.714232,
                    longitude: -73.9612889
                }]);

                results.should.be.a('string');
                results.should.include('<wpt lat="40.714232" lon="-73.9612889"><name></name></wpt>');
            });
        });

    });

})();