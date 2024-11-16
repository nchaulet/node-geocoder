var querystring = require('querystring'),
  util = require('util'),
  AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var MapQuestGeocoder = function OpenMapQuestGeocoder(httpAdapter, apiKey) {

  MapQuestGeocoder.super_.call(this, httpAdapter);

  if (!apiKey || apiKey == 'undefined') {

    throw new Error(this.constructor.name + ' needs an apiKey');
  }

  this.apiKey = apiKey;
  this._endpoint = 'https://open.mapquestapi.com/geocoding/v1';
};

util.inherits(MapQuestGeocoder, AbstractGeocoder);

/**
 * Geocode
 * @param <string>   value    Value to geocode (Address)
 * @param <function> callback Callback method
 */
MapQuestGeocoder.prototype._geocode = function (value, callback) {
  var _this = this;
  this.httpAdapter.get(this._endpoint + '/address', {
    'location': value,
    'key': querystring.unescape(this.apiKey)
  }, function (err, result) {
    if (err) {
      return callback(err);
    } else {
      if (result.info.statuscode !== 0) {
        return callback(new Error('Status is ' + result.info.statuscode + ' ' + result.info.messages[0]), {raw: result});
      }

      var results = [];

      var locations = result.results[0].locations;

      for (var i = 0; i < locations.length; i++) {
        results.push(_this._formatResult(locations[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

MapQuestGeocoder.prototype._formatResult = function (result) {
  var MQConfidenceLookup = {
    POINT: 1,
    ADDRESS: 0.9,
    INTERSECTION: 0.8, //less accurate than the MQ description
    STREET: 0.7,
    ZIP: 0.5,
    ZIP_EXTENDED: 0.5,
    NEIGHBORHOOD: 0.5,
    CITY: 0.4,
    COUNTY: 0.3,
    STATE: 0.2,
    COUNTRY: 0.1
  };
  return {
    'latitude': result.latLng.lat,
    'longitude': result.latLng.lng,
    'country': null,
    'countryCode': result.adminArea1,
    'city': result.adminArea5,
    'state': result.adminArea3,
    'zipcode': result.postalCode,
    'streetName': result.street,
    'streetNumber': null,
    'extra': {
      confidence: MQConfidenceLookup[result.geocodeQuality] || 0
    }

  };
};

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
MapQuestGeocoder.prototype._reverse = function (query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var _this = this;

  this.httpAdapter.get(this._endpoint + '/reverse', {
    'location': lat + ',' + lng,
    'key': querystring.unescape(this.apiKey)
  }, function (err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];
      var locations;

      if (result.results === undefined || !result.results.length) {
          return callback(new Error('Incorrect response'));
      }

      locations = result.results[0].locations;

      for (var i = 0; i < locations.length; i++) {
        results.push(_this._formatResult(locations[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

module.exports = MapQuestGeocoder;
