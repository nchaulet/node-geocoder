'use strict';

var chai   = require('chai');
var should = chai.should();
var expect = chai.expect;
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

describe('Geocoder', function() {
  beforeEach(function() {
    sinon.spy(stupidGeocoder, 'geocode');
    sinon.spy(stupidGeocoder, 'reverse');
  });

  afterEach(function() {
    stupidGeocoder.geocode.restore();
    stupidGeocoder.reverse.restore();
  });


  describe('#constructor' , function() {
    it('Should set _geocoder', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      geocoder._geocoder.should.be.equal(stupidGeocoder);
    });
  });

  describe('#geocode' , function() {
    it('Should call geocoder geocode method', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      return geocoder.geocode('127.0.0.1')
        .then(function() {
          stupidGeocoder.geocode.calledOnce.should.be.true;
        });
    });

    it('Should return a promise', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.geocode('127.0.0.1');
      promise.then.should.be.a('function');
    });
  });

  describe('#batchGeocode' , function() {
    it('Should call stupidGeocoder geocoder method x times', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      return geocoder.batchGeocode([
          '127.0.0.1',
          '127.0.0.1',
          '127.0.0.1'
      ]).then(function() {
        stupidGeocoder.geocode.calledThrice.should.be.true;
      });
    });

    it('Should return a promise', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.batchGeocode(['127.0.0.1']);
      promise.then.should.be.a('function');
    });
  });

  describe('#reverse' , function() {
    it('Should call stupidGeocoder reverse method', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      return geocoder.reverse(1, 2)
        .then(function() {
          stupidGeocoder.reverse.calledOnce.should.be.true;
        });
    });

    it('Should return a promise', function() {
      var geocoder = new Geocoder(stupidGeocoder);

      var promise = geocoder.reverse('127.0.0.1');

      promise.then.should.be.a('function');
    });
  });
});

