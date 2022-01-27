var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');
var countries = require('i18n-iso-countries');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var TomTomGeocoder = function TomTomGeocoder(httpAdapter, options) {

  TomTomGeocoder.super_.call(this, httpAdapter, options);

  if (!this.options.apiKey || this.options.apiKey == 'undefined') {
    throw new Error('You must specify an apiKey');
  }
};

util.inherits(TomTomGeocoder, AbstractGeocoder);

// TomTom geocoding API endpoint
TomTomGeocoder.prototype._endpoint = 'https://api.tomtom.com/search/2/geocode';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
TomTomGeocoder.prototype._geocode = function(value, callback) {

  var _this = this;

  var params = {
    key   : this.options.apiKey
  };

  if (this.options.language) {
    params.language = this.options.language;
  }

  var address = value;
  var url;
  if (typeof value === 'object') {
    if (!value.address) {
      return callback(new Error('You must specify a valid address.'));
    }

    address = value.address.toString()
    if (address === '') {
      return callback(new Error('You must specify a valid address.'));
    }

    if (value.country) {
      const country = value.country.toString()
      if (typeof country !== 'string' || !countries.isValid(country)) {
        return callback(new Error('Provided country is not valid.'));
      }

      params.country = value.country;
    }
  }

  url = this._endpoint + '/' + encodeURIComponent(value) + '.json';


  this.httpAdapter.get(url, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      for(var i = 0; i < result.results.length; i++) {
          results.push(_this._formatResult(result.results[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

TomTomGeocoder.prototype._formatResult = function(result) {
  return {
    'latitude' : result.position.lat,
    'longitude' : result.position.lon,
    'country' : result.address.country,
    'city' : result.address.localName,
    'state' : result.address.countrySubdivision,
    'zipcode' : result.address.postcode,
    'streetName': result.address.streetName,
    'streetNumber' : result.address.streetNumber,
    'countryCode' : result.address.countryCode
  };
};

module.exports = TomTomGeocoder;
