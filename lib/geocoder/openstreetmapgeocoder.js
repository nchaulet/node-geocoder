var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var OpenStreetMapGeocoder = function OpenStreetMapGeocoder(httpAdapter, options) {
    this.options = ['language','email','apiKey', 'osmServer'];

    OpenStreetMapGeocoder.super_.call(this, httpAdapter, options);
    var osmServer = (options && options.osmServer) || 'http://nominatim.openstreetmap.org';
    OpenStreetMapGeocoder.prototype._endpoint = osmServer + '/search';
    OpenStreetMapGeocoder.prototype._endpoint_reverse = osmServer + '/reverse';
};

util.inherits(OpenStreetMapGeocoder, AbstractGeocoder);

OpenStreetMapGeocoder.prototype._endpoint = 'http://nominatim.openstreetmap.org/search';

OpenStreetMapGeocoder.prototype._endpoint_reverse = 'http://nominatim.openstreetmap.org/reverse';

/**
* Geocode
* @param <string|object>   value    Value to geocode (Address or parameters, as specified at https://wiki.openstreetmap.org/wiki/Nominatim#Parameters)
* @param <function> callback Callback method
*/
OpenStreetMapGeocoder.prototype._geocode = function(value, callback) {
    var _this = this;

    var params = this._getCommonParams();
    params.addressdetails = 1;
    if (typeof value == 'string') {
      params.q = value;
    } else {
      for (var k in value) {
        var v = value[k];
        params[k] = v;
      }
    }
    this._forceParams(params);

    this.httpAdapter.get(this._endpoint , params, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            var results = [];

            if(result.error) {
              return callback(new Error(result.error));
            }

            if (result instanceof Array) {
              for (var i = 0; i < result.length; i++) {
                results.push(_this._formatResult(result[i]));
              }
            } else {
              results.push(_this._formatResult(result));
            }

            results.raw = result;
            callback(false, results);
        }

    });

};

OpenStreetMapGeocoder.prototype._formatResult = function(result) {

    var countryCode = result.address.country_code;
    if (countryCode) {
        countryCode = countryCode.toUpperCase();
    }

    var latitude = result.lat;
    if (latitude) {
      latitude = parseFloat(latitude);
    }

    var longitude = result.lon;
    if (longitude) {
      longitude = parseFloat(longitude);
    }

    return {
        'latitude' : latitude,
        'longitude' : longitude,
        'formattedAddress': result.display_name,
        'country' : result.address.country,
        'city' : result.address.city || result.address.town || result.address.village || result.address.hamlet,
        'state': result.address.state,
        'zipcode' : result.address.postcode,
        'streetName': result.address.road || result.address.cycleway,
        'streetNumber' : result.address.house_number,
        'countryCode' : countryCode,
        'neighbourhood': result.address.neighbourhood || ''
    };
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>, ...}  lat: Latitude, lon: Longitude, ... see https://wiki.openstreetmap.org/wiki/Nominatim#Parameters_2
* @param <function> callback Callback method
*/
OpenStreetMapGeocoder.prototype._reverse = function(query, callback) {

    var _this = this;

    var params = this._getCommonParams();
    for (var k in query) {
      var v = query[k];
      params[k] = v;
    }
    this._forceParams(params);

    this.httpAdapter.get(this._endpoint_reverse , params, function(err, result) {
        if (err) {
            return callback(err);
        } else {
          if(result.error) {
            return callback(new Error(result.error));
          }

          var results = [];
          if (result instanceof Array) {
            for (var i = 0; i < result.length; i++) {
              results.push(_this._formatResult(result[i]));
            }
          } else {
            results.push(_this._formatResult(result));
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
OpenStreetMapGeocoder.prototype._getCommonParams = function(){
    var params = {};

    for (var k in this.options) {
      var v = this.options[k];
      if (!v) {
        continue;
      }
      if (k === 'language') {
        k = 'accept-language';
      }
      params[k] = v;
    }

    return params;
};

OpenStreetMapGeocoder.prototype._forceParams = function(params){
    params.format = 'json';
    params.addressdetails = 1;
};

module.exports = OpenStreetMapGeocoder;
