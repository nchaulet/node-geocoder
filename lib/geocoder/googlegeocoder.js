'use strict';

var crypto = require('crypto');
var url = require('url');
var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey, region, excludePartialMatches)
 */
var GoogleGeocoder = function GoogleGeocoder(httpAdapter, options) {
  this.options = ['language', 'apiKey', 'clientId', 'region', 'excludePartialMatches', 'channel'];

  GoogleGeocoder.super_.call(this, httpAdapter, options);

  if (this.options.clientId && !this.options.apiKey) {
    throw new Error('You must specify a apiKey (privateKey)');
  }

  if (this.options.apiKey && !httpAdapter.supportsHttps()) {
    throw new Error('You must use https http adapter');
  }
};

util.inherits(GoogleGeocoder, AbstractGeocoder);

// Google geocoding API endpoint
GoogleGeocoder.prototype._endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Geocode
 * @param <string>   value    Value ton geocode (Address)
 * @param <function> callback Callback method
 */
GoogleGeocoder.prototype._geocode = function (value, callback) {

  var _this = this;
  var params = this._prepareQueryString();

  if (value.address) {
    var components = null;

    if (value.country) {
      components = 'country:' + value.country;
    }

    if (value.zipcode) {
      if (components) {
        components += '|';
      }
      components += 'postal_code:' + value.zipcode;
    }

    params.components = this._encodeSpecialChars(components);
    params.address = this._encodeSpecialChars(value.address);
  } else if (value.googlePlaceId) {
    params.place_id = value.googlePlaceId;
  } else {
    params.address = this._encodeSpecialChars(value);
  }

  if (value.language) {
    params.language = value.language;
  }

  if (value.region) {
    params.region = value.region;
  }

  var excludePartialMatches = params.excludePartialMatches;
  delete params.excludePartialMatches;

  this._signedRequest(this._endpoint, params);
  this.httpAdapter.get(this._endpoint, params, function (err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];
      // status can be "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", or "UNKNOWN_ERROR"
      // error_message may or may not be present
      if (result.status === 'ZERO_RESULTS') {
        results.raw = result;
        return callback(false, results);
      }

      if (result.status !== 'OK') {
        return callback(new Error('Status is ' + result.status + '.' + (result.error_message ? ' ' + result.error_message : '')), {raw: result});
      }

      for (var i = 0; i < result.results.length; i++) {

        var currentResult = result.results[i];

        if (excludePartialMatches && excludePartialMatches === true && typeof currentResult.partial_match !== 'undefined' && currentResult.partial_match === true) {
          continue;
        }

        results.push(_this._formatResult(currentResult));
      }

      results.raw = result;
      callback(false, results);
    }

  });

};

GoogleGeocoder.prototype._prepareQueryString = function () {
  var params = {
    'sensor': false
  };

  if (this.options.language) {
    params.language = this.options.language;
  }

  if (this.options.region) {
    params.region = this.options.region;
  }

  if (this.options.clientId) {
    params.client = this.options.clientId;
  } else if (this.options.apiKey) {
    params.key = this.options.apiKey;
  }

  if (this.options.channel) {
    params.channel = this.options.channel;
  }

  if (this.options.excludePartialMatches && this.options.excludePartialMatches === true) {
    params.excludePartialMatches = true;
  }

  return params;

};

GoogleGeocoder.prototype._signedRequest = function (endpoint, params) {

  if (this.options.clientId) {
    var request = url.parse(endpoint);
    var fullRequestPath = request.path + url.format({query: params});

    var decodedKey = new Buffer(this.options.apiKey.replace('-', '+').replace('_', '/'), 'base64');
    var hmac = crypto.createHmac('sha1', decodedKey);
    hmac.update(fullRequestPath);
    var signature = hmac.digest('base64');

    signature = signature.replace(/\+/g, '-').replace(/\//g, '_');

    params.signature = signature;
  }

  return params;
};

GoogleGeocoder.prototype._formatResult = function (result) {

  var googleConfidenceLookup = {
    ROOFTOP: 1,
    RANGE_INTERPOLATED: 0.9,
    GEOMETRIC_CENTER: 0.7,
    APPROXIMATE: 0.5
  };

  var extractedObj = {
    formattedAddress: result.formatted_address || null,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    extra: {
      googlePlaceId: result.place_id || null,
      confidence: googleConfidenceLookup[result.geometry.location_type] || 0,
      premise: null,
      subpremise: null,
      neighborhood: null,
      establishment: null
    },
    administrativeLevels: {
    }
  };

  for (var i = 0; i < result.address_components.length; i++) {
    var addressType = result.address_components[i].types[0];
    switch (addressType) {
      //Country
      case 'country':
        extractedObj.country = result.address_components[i].long_name;
        extractedObj.countryCode = result.address_components[i].short_name;
        break;
      //Administrative Level 1
      case 'administrative_area_level_1':
        extractedObj.administrativeLevels.level1long = result.address_components[i].long_name;
        extractedObj.administrativeLevels.level1short = result.address_components[i].short_name;
        break;
      //Administrative Level 2
      case 'administrative_area_level_2':
        extractedObj.administrativeLevels.level2long = result.address_components[i].long_name;
        extractedObj.administrativeLevels.level2short = result.address_components[i].short_name;
        break;
      //Administrative Level 3
      case 'administrative_area_level_3':
        extractedObj.administrativeLevels.level3long = result.address_components[i].long_name;
        extractedObj.administrativeLevels.level3short = result.address_components[i].short_name;
        break;
      //Administrative Level 4
      case 'administrative_area_level_4':
        extractedObj.administrativeLevels.level4long = result.address_components[i].long_name;
        extractedObj.administrativeLevels.level4short = result.address_components[i].short_name;
        break;
      //Administrative Level 5
      case 'administrative_area_level_5':
        extractedObj.administrativeLevels.level5long = result.address_components[i].long_name;
        extractedObj.administrativeLevels.level5short = result.address_components[i].short_name;
        break;
      // City
      case 'locality':
        extractedObj.city = result.address_components[i].long_name;
        break;
      // Address
      case 'postal_code':
        extractedObj.zipcode = result.address_components[i].long_name;
        break;
      case 'route':
        extractedObj.streetName = result.address_components[i].long_name;
        break;
      case 'street_number':
        extractedObj.streetNumber = result.address_components[i].long_name;
        break;
      case 'premise':
        extractedObj.extra.premise = result.address_components[i].long_name;
        break;
      case 'subpremise':
        extractedObj.extra.subpremise = result.address_components[i].long_name;
        break;
      case 'establishment':
        extractedObj.extra.establishment = result.address_components[i].long_name;
        break;
      case 'sublocality_level_1':
      case 'political':
      case 'sublocality':
      case 'neighborhood':
        if(!extractedObj.extra.neighborhood) {
          extractedObj.extra.neighborhood = result.address_components[i].long_name;
        }
        break;
    }
  }
  return extractedObj;
};

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
GoogleGeocoder.prototype._reverse = function (query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var _this = this;
  var params = this._prepareQueryString();

  params.latlng = lat + ',' + lng;

  if (query.language) {
    params.language = query.language;
  }

  if (query.result_type) {
    params.result_type = query.result_type;
  }

  if (query.location_type) {
    params.location_type = query.location_type;
  }

  this._signedRequest(this._endpoint, params);
  this.httpAdapter.get(this._endpoint, params, function (err, result) {
    if (err) {
      return callback(err);
    } else {
      // status can be "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", or "UNKNOWN_ERROR"
      // error_message may or may not be present
      if (result.status !== 'OK') {
        return callback(new Error('Status is ' + result.status + '.' + (result.error_message ? ' ' + result.error_message : '')), {raw: result});
      }

      var results = [];

      if (result.results.length > 0) {
        results.push(_this._formatResult(result.results[0]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

GoogleGeocoder.prototype._encodeSpecialChars = function(value) {
  if (typeof value === 'string') {
    return value.replace(/\u001a/g, ' ');
  }

  return value;
};

module.exports = GoogleGeocoder;
