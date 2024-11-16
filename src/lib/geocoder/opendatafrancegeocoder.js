var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var OpendataFranceGeocoder = function OpendataFranceGeocoder(httpAdapter, options) {
    this.options = ['language','email','apiKey'];

    OpendataFranceGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(OpendataFranceGeocoder, AbstractGeocoder);

OpendataFranceGeocoder.prototype._endpoint = 'https://api-adresse.data.gouv.fr/search';

OpendataFranceGeocoder.prototype._endpoint_reverse = 'https://api-adresse.data.gouv.fr/reverse';

/**
* Geocode
* @param <string|object>   value    Value to geocode (Address or parameters, as specified at https://opendatafrance/api/)
* @param <function> callback Callback method
*/
OpendataFranceGeocoder.prototype._geocode = function(value, callback) {
    var _this = this;

    var params = this._getCommonParams();

    if (typeof value == 'string') {
      params.q = value;
    } else {
      if (value.address) {
        params.q = value.address;
      }
      if (value.lat && value.lon) {
        params.lat = value.lat;
        params.lon = value.lon;
      }
      if (value.zipcode) {
        params.postcode = value.zipcode;
      }
      if (value.type) {
        params.type = value.type;
      }
      if (value.citycode) {
        params.citycode = value.citycode;
      }
      if (value.limit) {
        params.limit = value.limit;
      }
    }

    this.httpAdapter.get(this._endpoint, params, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            if (result.error) {
              return callback(new Error(result.error));
            }

            var results = [];

            if (result.features) {
              for (var i = 0; i < result.features.length; i++) {
                results.push(_this._formatResult(result.features[i]));
              }
            }

            results.raw = result;
            callback(false, results);
        }

    });

};

OpendataFranceGeocoder.prototype._formatResult = function(result) {

    var latitude = result.geometry.coordinates[1];
    if (latitude) {
      latitude = parseFloat(latitude);
    }

    var longitude = result.geometry.coordinates[0];
    if (longitude) {
      longitude = parseFloat(longitude);
    }

    var properties = result.properties;

    var formatedResult = {
        latitude : latitude,
        longitude : longitude,
        state : properties.context,
        city : properties.city,
        zipcode : properties.postcode,
        citycode : properties.citycode,
        countryCode : 'FR',
        country : 'France',
        type: properties.type,
        id: properties.id
    };

    if (properties.type === 'housenumber') {
      formatedResult.streetName = properties.street;
      formatedResult.streetNumber = properties.housenumber;
    } else if (properties.type === 'street') {
      formatedResult.streetName = properties.name;
    } else if (properties.type === 'city') {
      formatedResult.population = properties.population;
      formatedResult.adm_weight = properties.adm_weight;
    } else if (properties.type === 'village') {
      formatedResult.population = properties.population;
    } else if (properties.type === 'locality') {
      formatedResult.streetName = properties.name;
    }

    return formatedResult;
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>, ...}  lat: Latitude, lon: Longitude, ... see https://wiki.openstreetmap.org/wiki/Nominatim#Parameters_2
* @param <function> callback Callback method
*/
OpendataFranceGeocoder.prototype._reverse = function(query, callback) {

    var _this = this;

    var params = this._getCommonParams();
    for (var k in query) {
      var v = query[k];
      params[k] = v;
    }

    this.httpAdapter.get(this._endpoint_reverse , params, function(err, result) {
        if (err) {
            return callback(err);
        } else {

          if(result.error) {
            return callback(new Error(result.error));
          }

          var results = [];

          if (result.features) {
            for (var i = 0; i < result.features.length; i++) {
              results.push(_this._formatResult(result.features[i]));
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
OpendataFranceGeocoder.prototype._getCommonParams = function(){
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

module.exports = OpendataFranceGeocoder;
