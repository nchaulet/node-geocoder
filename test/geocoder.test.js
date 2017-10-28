'use strict';

var chai   = require('chai');
var should = chai.should();
var assert = chai.assert;
var sinon  = require('sinon');

var Geocoder = require('../lib/geocoder.js');

var stupidGeocoder = {
  geocode: function(data, cb) {
    cb(null, []);
  },
  reverse: function(data, cb) {
    cb(null, []);
  }
};

describe('Geocoder', () => {
  beforeEach(() => {
    sinon.spy(stupidGeocoder, 'geocode');
    sinon.spy(stupidGeocoder, 'reverse');
  });

  afterEach(() => {
    stupidGeocoder.geocode.restore();
    stupidGeocoder.reverse.restore();
  });


  describe('#constructor' , () => {
    test('Should set _geocoder', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      geocoder._geocoder.should.be.equal(stupidGeocoder);
    });
  });

  describe('#geocode' , () => {
    test('Should call geocoder geocode method', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      return geocoder.geocode('127.0.0.1')
        .then(function() {
          stupidGeocoder.geocode.calledOnce.should.be.true;
        });
    });

    test('Should return a promise', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.geocode('127.0.0.1');
      promise.then.should.be.a('function');

      return promise;
    });
  });

  describe('#batchGeocode' , () => {
    test('Should call stupidGeocoder geocoder method x times', () => {
      var geocoder = new Geocoder(stupidGeocoder);
      return geocoder.batchGeocode([
        '127.0.0.1',
        '127.0.0.1'
      ]).then(function() {
        assert.isTrue(stupidGeocoder.geocode.calledTwice);
      });
    });

    test('Should return a promise', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.batchGeocode(['127.0.0.1']);
      promise.then.should.be.a('function');

      return promise;
    });
  });

  describe('#reverse' , () => {
    test('Should call stupidGeocoder reverse method', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      return geocoder.reverse(1, 2)
        .then(function() {
          stupidGeocoder.reverse.calledOnce.should.be.true;
        });
    });

    test('Should return a promise', () => {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.reverse('127.0.0.1');

      promise.then.should.be.a('function');
    });
  });
});

