'use strict';

var util = require('util'),
  net = require('net'),
  AbstractGeocoder = require('./abstractgeocoder');

var ValueError = require('../error/valueerror.js');

function formatGeocoderName(name) {
  return name.toLowerCase().replace(/geocoder$/, '');
}

/**
 * APlaceGeocoder Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, apiKey)
 */
var APlaceGeocoder = function (httpAdapter, options) {
  this.supportIPv4 = false;
  this.supportIPv6 = false;
  this.supportAddress = true;
  APlaceGeocoder.super_.call(this, httpAdapter);

  if (!this.constructor.name) {
    throw new Error('The Constructor must be named');
  }

  this.name = formatGeocoderName(this.constructor.name);

  if (!httpAdapter || httpAdapter == 'undefined') {
    throw new Error(this.constructor.name + ' need an httpAdapter');
  }
  this.httpAdapter = httpAdapter;

  if (options) {
    for (var k in options) {
      this.options[k] = options[k];
    }
  }

  if (!this.options.language) {
    this.options.language = 'en';
  }

  if (!this.options.apiKey) {
    throw new Error('You must specify a apiKey (see https://aplace.io/en/documentation/general/authentication)');
  }

  if (this.options.apiKey && !httpAdapter.supportsHttps()) {
    throw new Error('You must use https http adapter');
  }

  this.options = options;
};

util.inherits(APlaceGeocoder, AbstractGeocoder);

// APlace geocoding API endpoint
APlaceGeocoder.prototype._geocoderEndpoint =
  'https://api.aplace.io/api/v1.0/search';


// APlace reverse API endpoint
APlaceGeocoder.prototype._reverseEndpoint =
  'https://api.aplace.io/api/v1.0/pip';

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
APlaceGeocoder.prototype.reverse = function (query, callback) {
  return this._reverse(query, callback);
};

/**
 * Geocode
 * @param <string>   value    Value to geocode
 * @param <function> callback Callback method
 */
APlaceGeocoder.prototype.geocode = function (value, callback) {
  if (
    net.isIPv4(value) &&
    (!this.supportIPv4 || this.supportIPv4 == 'undefined')
  ) {
    throw new ValueError(
      this.constructor.name + ' does not support geocoding IPv4'
    );
  }

  if (
    net.isIPv6(value) &&
    (!this.supportIPv6 || this.supportIPv6 == 'undefined')
  ) {
    throw new ValueError(
      this.constructor.name + ' does not support geocoding IPv6'
    );
  }
  return this._geocode(value, callback);
};

/**
 * Batch Geocode
 * @param <string[]>   values    Valueas to geocode
 * @param <function> callback Callback method
 */
APlaceGeocoder.prototype.batchGeocode = function (values, callback) {
  Promise.all(
    values.map(value =>
      new Promise(resolve => {
        this.geocode(value, (error, value) => {
          resolve({
            error,
            value
          });
        });
      })
    )
  )
    .then(data => callback(null, data));
};

APlaceGeocoder.prototype._reverse = function (query, callback) {
  try {
    const that = this;
    const lat = query.lat;
    const lon = query.lon;

    if (!lat || !lon) {
      throw new ValueError('no valid lat or lon given');
    }

    const params = {
      key: this.options.apiKey,
      lat: lat,
      lon: lon
    };

    this.httpAdapter.get(this._reverseEndpoint, params, function (err, response) {
      if (err) {
        return callback(err);
      } else {
        if (!response.session_id) {
          return callback(
            new Error(
              'Status is ' +
              response.status +
              '.' +
              (response.error_message ? ' ' + response.error_message : '')
            ),
            { raw: response }
          );
        }
        var results = [];

        if (response.data && response.data.length > 0) {
          results.push(that._formatResult(response.data[0]));
        }
        results.raw = response;
        callback(false, results);
      }
    });
  } catch (error) {
    return callback(error);
  }
}

APlaceGeocoder.prototype._geocode = function (value, callback) {
  try {
    const that = this;
    let query;

    if (typeof value === 'string') {
      query = value;
    }
    if (typeof value === 'object') {
      const queryKeys = ['address', 'zip', 'city', 'country', 'countryCode'];
      const queryParts = [];
      for (const key in queryKeys) {
        if (value[key] && value[key].length > 0) {
          queryParts.push(value[key]);
        }
      }
      query = queryParts.join(' ');
    }
    const params = {
      key: this.options.apiKey,
      q: query.trim(),
      lang: this.options.language,
      type: 'house_number'
    };

    const queryParams = ['type', 'lat', 'lon', 'radius', 'countries'];
    for (const key in queryParams) {
      if (value[queryParams[key]]) {
        params[queryParams[key]] = value[queryParams[key]];
      }
    }

    const validResultsTypes = ['house_number', 'road', 'quarter', 'city', 'county', 'state', 'region', 'country'];
    if (params.type) {
      if (typeof params.type === 'string') {
        if (validResultsTypes.indexOf(params.type) === -1) {
          throw new Error('type must be one of ' + validResultsTypes.join(', '));
        }
      }
    }

    for (const key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }

    this.httpAdapter.get(this._geocoderEndpoint, params, function (err, response) {
      if (err) {
        return callback(err);
      } else {
        if (!response.session_id) {
          return callback(
            new Error(
              'Status is ' +
              response.status +
              '.' +
              (response.error_message ? ' ' + response.error_message : '')
            ),
            { raw: response }
          );
        }
        var results = [];

        if (response.data && response.data.length > 0) {
          results.push(that._formatResult(response.data[0]));
        }
        results.raw = response;
        callback(false, results);
      }
    });
  } catch (error) {
    return callback(error);
  }
}

APlaceGeocoder.prototype._formatResult = function (result) {
  let formattedAddress = result.match;
  if (result.match_details && result.match_details.length > 0) {
    formattedAddress += ', ' + result.match_details;
  }
  var extractedObj = {
    formattedAddress: formattedAddress || null,
    latitude: result.lat,
    longitude: result.lon,
    extra: {},
    administrativeLevels: {}
  };

  for (const key in result.address) {
    switch (key) {
      // Address
      case 'postal_code':
        extractedObj.zipcode = result.address.postcode;
        break;

      case 'road':
        extractedObj.streetName = result.address.road;
        break;

      case 'street_number':
        extractedObj.streetNumber = result.address.house_number;
        break;

      case 'country':
        extractedObj.administrativeLevels.level1long = result.address.country;
        extractedObj.administrativeLevels.level1short = result.address.country_code;
        extractedObj.extra.country = result.address.country;
        extractedObj.extra.countryCode = result.address.country_code;
        break;

      case 'region':
        extractedObj.administrativeLevels.level2long = result.address.region;
        extractedObj.administrativeLevels.level2short = result.address.region_code;
        extractedObj.extra.region = result.address.region;
        extractedObj.extra.regionCode = result.address.region_code;
        break;

      case 'state':
        extractedObj.administrativeLevels.level3long = result.address.state;
        extractedObj.administrativeLevels.level3short = result.address.state_code;
        extractedObj.extra.state = result.address.state;
        extractedObj.extra.stateCode = result.address.state_code;
        break;

      case 'county':
        extractedObj.administrativeLevels.level4long = result.address.county;
        extractedObj.extra.county = result.address.county;
        break;

      case 'city':
        extractedObj.administrativeLevels.level5long = result.address.city;
        break;

      case 'quarter':
        extractedObj.administrativeLevels.level6long = result.address.quarter;
        extractedObj.extra.quarter = result.address.quarter;
        extractedObj.neighbourhood = result.address.quarter;
        break;
    }
  }
  return extractedObj;
};

module.exports = APlaceGeocoder;
