var crypto = require('crypto'),
  url = require('url'),
  util = require('util'),
  AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey, region)
 */
var GoogleGeocoder = function GoogleGeocoder(httpAdapter, options) {
  this.options = ['language', 'apiKey', 'clientId', 'region'];

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
GoogleGeocoder.prototype._geocode = function(value, callback) {

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

    params.components = components;
    params.address = value.address;
  } else {
    params.address = value;
  }

  this._signedRequest(this._endpoint, params);
  this.httpAdapter.get(this._endpoint, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      // status can be "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", or "UNKNOWN_ERROR"
      // error_message may or may not be present
      if (result.status === 'ZERO_RESULTS') {
        results = [];
        results.raw = result;
        return callback(false, results);
      }

      if (result.status !== 'OK') {
        return callback(new Error('Status is ' + result.status + '.' + (result.error_message ? ' ' + result.error_message : '')), {raw: result});
      }

      var results = [];

      for (var i = 0; i < result.results.length; i++) {
        results.push(_this._formatResult(result.results[i]));
      }

      results.raw = result;
      callback(false, results);
    }

  });

};

GoogleGeocoder.prototype._prepareQueryString = function() {
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

  return params;
};

GoogleGeocoder.prototype._signedRequest = function(endpoint, params) {
  if (this.options.clientId) {
    var request = url.parse(endpoint);
    var fullRequestPath = request.path + url.format({query: params});
    var decodedKey = new Buffer(this.options.apiKey.replace('-', '+').replace('_', '/'), 'base64').toString('binary');
    var hmac = crypto.createHmac('sha1', decodedKey);
    hmac.update(fullRequestPath);
    var signature = hmac.digest('base64');

    signature = signature.replace(/\+/g, '-').replace(/\//g, '_');

    params.signature = signature;
  }

  return params;
};

GoogleGeocoder.prototype._formatResult = function(result) {

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

      //State
      case 'administrative_area_level_1':
        extractedObj.state = result.address_components[i].long_name;
        extractedObj.stateCode = result.address_components[i].short_name;
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
      case 'neighborhood':
        extractedObj.extra.neighborhood = result.address_components[i].long_name;
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
GoogleGeocoder.prototype._reverse = function(query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var _this = this;
  var params = this._prepareQueryString();
  params.latlng = lat + ',' + lng;
  this._signedRequest(this._endpoint, params);
  this.httpAdapter.get(this._endpoint, params, function(err, result) {
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

module.exports = GoogleGeocoder;
