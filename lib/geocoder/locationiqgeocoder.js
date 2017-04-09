var
  querystring      = require('querystring'),
  util             = require('util'),
  AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 *
 * Geocoder for LocationIQ
 * http://locationiq.org/#docs
 *
 * @param {[type]} httpAdapter [description]
 * @param {String} apiKey      [description]
 */
var LocationIQGeocoder = function LocationIQGeocoder(httpAdapter, apiKey) {

  LocationIQGeocoder.super_.call(this, httpAdapter);

  if (!apiKey || apiKey == 'undefined') {
    throw new Error('LocationIQGeocoder needs an apiKey');
  }

  this.apiKey = querystring.unescape(apiKey);
};

util.inherits(LocationIQGeocoder, AbstractGeocoder);

LocationIQGeocoder.prototype._endpoint = 'http://locationiq.org/v1';
LocationIQGeocoder.prototype._endpoint_reverse = 'http://osm1.unwiredlabs.com/locationiq/v1/reverse.php';

/**
 * Geocode
 * @param  {string|object}   value
 *   Value to geocode (Adress String or parameters as specified over at
 *   http://locationiq.org/#docs)
 * @param  {Function} callback callback method
 */
LocationIQGeocoder.prototype._geocode = function(value, callback) {
  var params = this._getCommonParams();

  if (typeof value === 'string') {
    params.q = value;
  } else {
    for (var k in value) {
      var v = value[k];
      switch(k) {
        default:
          params[k] = v;
          break;
        // alias for postalcode
        case 'zipcode':
          params.postalcode = v;
          break;
        // alias for street
        case 'address':
          params.street = v;
          break;
      }
    }
  }
  this._forceParams(params);

  this.httpAdapter.get(this._endpoint + '/search.php', params,
    function(err, responseData) {
      if (err) {
        return callback(err);
      }

      // when there’s no err thrown here the resulting array object always
      // seemes to be defined but empty so no need to check for
      // responseData.error for now
      // add check if the array is not empty, as it returns an empty array from time to time
      var results = [];
      if (responseData.length && responseData.length > 0) {
        results = responseData.map(this._formatResult).filter(function(result) {
          return result.longitude && result.latitude;
        });
        results.raw = responseData;
      }

      callback(false, results);
    }.bind(this));
};

/**
 * Reverse geocoding
 * @param  {lat:<number>,lon<number>}   query    lat: Latitude, lon: Longitutde and additional parameters as specified here: http://locationiq.org/#docs
 * @param  {Function} callback Callback method
 */
LocationIQGeocoder.prototype._reverse = function(query, callback) {
  var params = this._getCommonParams();

  for (var k in query) {
    var v = query[k];
    params[k] = v;
  }
  this._forceParams(params);

  this.httpAdapter.get(this._endpoint_reverse, params,
    function(err, responseData) {
      if (err) {
        return callback(err);
      }

      // when there’s no err thrown here the resulting array object always
      // seemes to be defined but empty so no need to check for
      // responseData.error for now

      // locationiq always seemes to answer with a single object instead
      // of an array
      var results = [responseData].map(this._formatResult).filter(function(result) {
        return result.longitude && result.latitude;
      });
      results.raw = responseData;

      callback(false, results);
    }.bind(this));
};

LocationIQGeocoder.prototype._formatResult = function(result) {
  // transform lat and lon to real floats
  var transformedResult = {
    'latitude' : result.lat ? parseFloat(result.lat) : undefined,
    'longitude' : result.lon ? parseFloat(result.lon) : undefined
  };

  if (result.address) {
    transformedResult.country = result.address.country;
    transformedResult.country = result.address.country;
    transformedResult.city = result.address.city || result.address.town || result.address.village || result.address.hamlet;
    transformedResult.state = result.address.state;
    transformedResult.zipcode = result.address.postcode;
    transformedResult.streetName = result.address.road || result.address.cycleway;
    transformedResult.streetNumber = result.address.house_number;
    // make sure countrycode is always uppercase to keep node-geocoder api formats
    transformedResult.countryCode = result.address.country_code.toUpperCase();
  }
  return transformedResult;
};

/**
* Prepare common params
*
* @return <Object> common params
*/
LocationIQGeocoder.prototype._getCommonParams = function() {
  return {
    'key': this.apiKey
  };
};

/**
 * Adds parameters that are enforced
 *
 * @param  {object} params object containing the parameters
 */
LocationIQGeocoder.prototype._forceParams = function(params) {
  params.format = 'json';
  params.addressdetails = '1';
};


module.exports = LocationIQGeocoder;
