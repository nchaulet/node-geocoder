'use strict';
var chai = require('chai');
var should = chai.should();

var GpxFormatter = require('../../lib/formatter/gpxformatter.js');

describe('GpxFormatter', () => {
  describe('#format' , () => {
    test('should format using gpx format', () => {
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
