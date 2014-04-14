var net = require('net');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var TomTomGeocoder = function(httpAdapter, options) {

    if (!httpAdapter || httpAdapter == 'undefinded') {

        throw new Error('TomTom Geocoder need an httpAdapter');
    }

    if (!options || options == 'undefinded') {
        options = {};
    }

    if (!options.apiKey || options.apiKey == 'undefinded') {
        throw new Error('You must specify an apiKey');
    }


    this.options = options;

    this.httpAdapter = httpAdapter;
};

// TomTom geocoding API endpoint
TomTomGeocoder.prototype._endpoint = 'http://api.tomtom.com/lbs/geocoding/geocode';

/**
* Geocode
* @param <string>   value    Value to geocode (Adress)
* @param <function> callback Callback method
*/
TomTomGeocoder.prototype.geocode = function(value, callback) {

    if (net.isIP(value)) {
        throw new Error('TomTom Geocoder no suport geocoding ip');
    }

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

/**
* Reverse geocoding
* @param <integer>  lat      Latittude
* @param <integer>  lng      Longitude
* @param <function> callback Callback method
*/
TomTomGeocoder.prototype.reverse = function(lat, lng, callback) {
    throw new Error('TomTomGeocoder no support reverse geocoding');
};

module.exports = TomTomGeocoder;
