var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var TomTomGeocoder = function(httpAdapter, options) {
    this.name = 'TomTomGeocoder';
    
    TomTomGeocoder.super_.call(this, httpAdapter, options);

    if (!this.options.apiKey || this.options.apiKey == 'undefinded') {
        throw new Error('You must specify an apiKey');
    }
};

util.inherits(TomTomGeocoder, AbstractGeocoder);

// TomTom geocoding API endpoint
TomTomGeocoder.prototype._endpoint = 'http://api.tomtom.com/lbs/geocoding/geocode';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
TomTomGeocoder.prototype._geocode = function(value, callback) {

    var _this = this;

    var params = {
        query : value,
        key   : this.options.apiKey,
        format: 'json' 
    };

    this.httpAdapter.get(this._endpoint, params, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            
            var results = [];

            for(var i = 0; i < result.geoResponse.geoResult.length; i++) {
                results.push(_this._formatResult(result.geoResponse.geoResult[i]));
            }

            callback(false, results);
        }

    });

};

TomTomGeocoder.prototype._formatResult = function(result) {
    return {
        'latitude' : result.latitude,
        'longitude' : result.longitude,
        'country' : result.country,
        'city' : result.city,
        'state' : result.state,
        'zipcode' : result.postcode,
        'streetName': result.street,
        'streetNumber' : result.houseNumber,
        'countryCode' : result.countryISO3

    };
};

module.exports = TomTomGeocoder;
