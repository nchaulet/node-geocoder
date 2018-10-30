var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var FreegeoipGeocoder = function FreegeoipGeocoder(httpAdapter) {
    this.supportIPv4   = true;
    this.supportIPv6   = true;
    this.supportAddress = false;
    FreegeoipGeocoder.super_.call(this, httpAdapter);
};

util.inherits(FreegeoipGeocoder, AbstractGeocoder);

// WS endpoint
FreegeoipGeocoder.prototype._endpoint = 'https://freegeoip.net/json/';

/**
* Geocode
* @param <string>   value    Value to geocode (IP only)
* @param <function> callback Callback method
*/
FreegeoipGeocoder.prototype._geocode = function(value, callback) {
    this.httpAdapter.get(this._endpoint + value , { }, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            var results = [];

            results.push({
                'ip' : result.ip,
                'countryCode' : result.country_code,
                'country' : result.country_name,
                'regionCode' : result.region_code,
                'regionName' : result.region_name,
                'city' : result.city,
                'zipcode' : result.zip_code,
                'timeZone' : result.time_zone,
                'latitude' : result.latitude,
                'longitude' : result.longitude,
                'metroCode' : result.metro_code

            });

            results.raw = result;
            callback(false, results);
        }

    });

};

module.exports = FreegeoipGeocoder;
