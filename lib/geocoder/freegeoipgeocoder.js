var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var FreegeoipGeocoder = function(httpAdapter) {
    this.name          = 'FreegeoipGeocoder';
    this.supportIPv4   = true;
    this.supportIPv6   = true;
    this.supportAddress = false;
    FreegeoipGeocoder.super_.call(this, httpAdapter);
};

util.inherits(FreegeoipGeocoder, AbstractGeocoder);

// WS endpoint
FreegeoipGeocoder.prototype._endpoint = 'http://freegeoip.net/json/';

/**
* Geocode
* @param <string>   value    Value to geocode (IP only)
* @param <function> callback Callback method
*/
FreegeoipGeocoder.prototype._geocode = function(value, callback) {
    var _this = this;

    this.httpAdapter.get(this._endpoint + value , { }, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            var results = [];

            results.push({
                'latitude' : result.latitude,
                'longitude' : result.longitude,
                'country' : result.country_name,
                'city' : result.city,
                'zipcode' : result.zipcode,
                'streetName': null,
                'streetNumber' : null,
                'countryCode' : result.country_code

            });

            callback(false, results);
        }

    });

};

module.exports = FreegeoipGeocoder;
