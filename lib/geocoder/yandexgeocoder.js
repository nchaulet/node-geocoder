'use strict';

var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var YandexGeocoder = function YandexGeocoder(httpAdapter, options) {
  YandexGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(YandexGeocoder, AbstractGeocoder);

function _findKey(result, wantedKey) {
  var val = null;
  Object.keys(result).every(function(key) {

  if (key === wantedKey) {
    val = result[key];
    return false;
  }

  if (typeof result[key] === 'object') {
    val = _findKey(result[key], wantedKey);

    return val === null ? true : false;
  }

  return true;
  });

  return val;
}

function _formatResult(result) {
  var position = result.GeoObject.Point.pos.split(' ');
  result = result.GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails;

  return {
    'latitude' : parseFloat(position[1]),
    'longitude' : parseFloat(position[0]),
    'city' : _findKey(result, 'LocalityName'),
    'state' : _findKey(result, 'AdministrativeAreaName'),
    'streetName': _findKey(result, 'ThoroughfareName'),
    'streetNumber' : _findKey(result, 'PremiseNumber'),
    'countryCode' : _findKey(result, 'CountryNameCode'),
    'country' : _findKey(result, 'CountryName')
  };
}

function _processOptionsToParams(params, options){

  //language (language_region, ex: `ru_RU`, `uk_UA`)
  if (options.language) {
    params.lang = options.language;
  }

  //results count (default 10)
  if (options.results) {
    params.results = options.results;
  }

  //skip count (default 0)
  if (options.skip) {
    params.skip = options.skip;
  }

  //Type of toponym (only for reverse geocoding)
  //could be `house`, `street`, `metro`, `district`, `locality`
  if (options.kind) {
    params.kind = options.kind;
  }

  //BBox (ex: `[[lat: 1.0, lng:2.0],[lat: 1.1, lng:2.2]]`)
  if (options.bbox) {
    if (options.bbox.length === 2){
      params.kind = options.bbox[0].lng + ',' + options.bbox[0].lat;
      params.kind = params.kind + '~';
      params.kind = params.kind + options.bbox[1].lng + ',' + options.bbox[1].lat;
    }
  }

  //Limit search in bbox (1) or not limit (0)
  if (options.rspn) {
    params.rspn = options.rspn;
  }
}

// Yandex geocoding API endpoint
YandexGeocoder.prototype._endpoint = 'https://geocode-maps.yandex.ru/1.x/';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
YandexGeocoder.prototype._geocode = function(value, callback) {
  var params = {
    geocode : value,
    format: 'json'
  };

  _processOptionsToParams(params, this.options);

  this.httpAdapter.get(this._endpoint, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      result.response.GeoObjectCollection.featureMember.forEach(function(geopoint) {
        results.push(_formatResult(geopoint));
      });

      results.raw = result;
      callback(false, results);
    }
  });
};

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
YandexGeocoder.prototype._reverse = function (query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var value = lng + ',' + lat;

  this._geocode(value, callback);
};


module.exports = YandexGeocoder;
