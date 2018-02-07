var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var VirtualEarthGeocoder = function VirtualEarthGeocoder(httpAdapter, options) {

  VirtualEarthGeocoder.super_.call(this, httpAdapter, options);

  if (!this.options.apiKey || this.options.apiKey == 'undefined') {
    throw new Error('You must specify an apiKey');
  }
};

util.inherits(VirtualEarthGeocoder, AbstractGeocoder);

// TomTom geocoding API endpoint
VirtualEarthGeocoder.prototype._endpoint = 'http://dev.virtualearth.net/REST/v1/Locations';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
VirtualEarthGeocoder.prototype._geocode = function(value, callback) {

  var _this = this;

  var params = {
    q : value,
    key   : this.options.apiKey
  };

  this.httpAdapter.get(this._endpoint, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      for(var i = 0; i < result.resourceSets[0].resources.length; i++) {
          results.push(_this._formatResult(result.resourceSets[0].resources[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

/**
* Reverse geocoding
* @param {lat:<number>, lon:<number>}  lat: Latitude, lon: Longitude
* @param <function> callback Callback method
*/
VirtualEarthGeocoder.prototype._reverse = function(value, callback) {

  var _this = this;

  var params = {
    key: this.options.apiKey
  };

  var endpoint = this._endpoint + "/" + value.lat + "," + value.lon;

  this.httpAdapter.get(endpoint, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      for(var i = 0; i < result.resourceSets[0].resources.length; i++) {
          results.push(_this._formatResult(result.resourceSets[0].resources[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
}

VirtualEarthGeocoder.prototype._formatResult = function(result) {
  return {
    'latitude' : result.point.coordinates[0],
    'longitude' : result.point.coordinates[1],
    'country' : result.address.countryRegion,
    'city' : result.address.locality,
    'state' : result.address.adminDistrict,
    'zipcode' : result.address.postalCode,
    'streetName': result.address.addressLine,
    'formattedAddress': result.address.formattedAddress
  };
};

module.exports = VirtualEarthGeocoder;
