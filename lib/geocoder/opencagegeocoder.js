var util = require('util'),
  AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var OpenCageGeocoder = function OpenCageGeocoder(httpAdapter, apiKey, options) {
  this.options = ['language'];

  OpenCageGeocoder.super_.call(this, httpAdapter, options);

  if (!apiKey || apiKey == 'undefined') {
    throw new Error(this.constructor.name + ' needs an apiKey');
  }

  this.apiKey = apiKey;
  this._endpoint = 'http://api.opencagedata.com/geocode/v1/json';
};

util.inherits(OpenCageGeocoder, AbstractGeocoder);

var openCageRequestConfidence = {
    0.9: 10, // < .25km
    0.8: 8, // < 1km
    0.7: 7, // < 5km
    0.6: 5, // < 10km
    0.5: 4, // < 15km
    0.4: 2, // < 25km
    0.3: 1, // > 25km
    0.2: 1, // > 25km
    0.1: 1, // > 25km
    0: 0 // NA
};
var openCageResultConfidence = {
    10: 0.9, // < .25km
    9: 0.8, // < .5km
    8: 0.8, // < 1km
    7: 0.7, // < 5km
    6: 0.6, // < 7.5km
    5: 0.6, // < 10km
    4: 0.5, // < 15km
    3: 0.4, // < 15km
    2: 0.4, // < 25km
    1: 0.3, // > 25km
    0: 0 // NA
};

/**
 * Geocode
 * @param <string>   value    Value to geocode (Address)
 * @param <function> callback Callback method
 */
OpenCageGeocoder.prototype._geocode = function (value, callback) {
  var _this = this;

  var params = this._getCommonParams();
  if (value.address) {
    if (value.bounds) {
      if (Array.isArray(value.bounds)) {
        params.bounds = value.bounds.join(',');
      }
      else {
        params.bounds = value.bounds;
      }
    }
    if (value.countryCode) {
      params.countrycode = value.countryCode;
    }
    if (value.limit) {
      params.limit = value.limit;
    }
    if (value.minConfidence) {
      params.min_confidence = openCageRequestConfidence[value.minConfidence] || value.minConfidence;
    }
    params.q = value.address;
  }
  else {
    params.q = value;
  }

  this.httpAdapter.get(this._endpoint, params, function (err, result) {

    if (err) {
      return callback(err);
    } else {

      var results = [];

      if (result && result.results instanceof Array) {
        for (var i = 0; i < result.results.length; i++) {
          results.push(_this._formatResult(result.results[i]));
        }
      }

      results.raw = result;
      callback(false, results);
    }

  });

};

OpenCageGeocoder.prototype._formatResult = function (result) {
  return {
    'latitude': result.geometry.lat,
    'longitude': result.geometry.lng,
    'country': result.components.country,
    'city': result.components.city,
    'state': result.components.state,
    'zipcode': result.components.postcode,
    'streetName': result.components.road,
    'streetNumber': result.components.house_number,
    'countryCode': result.components.country_code,
    'county': result.components.county,
    'extra': {
      confidence: openCageResultConfidence[result.confidence] || 0
    }
  };
};

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
OpenCageGeocoder.prototype._reverse = function (query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var _this = this;

  var params = this._getCommonParams();
  params.q = lat + ' ' + lng;

  this.httpAdapter.get(this._endpoint, params, function (err, result) {
    if (err) {
      callback(err);
    } else {
      var results = [];

      if (result && result.results instanceof Array) {
        for (var i = 0; i < result.results.length; i++) {
          results.push(_this._formatResult(result.results[i]));
        }
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

/**
 * Prepare common params
 *
 * @return <Object> common params
 */
OpenCageGeocoder.prototype._getCommonParams = function () {
  var params = {};
  params.key = this.apiKey;

  if (this.options.language) {
    params.language = this.options.language;
  }

  return params;
};

module.exports = OpenCageGeocoder;
