'use strict';
(function () {

    var net = require('net');

    /**
     * Constructor
     */
    var FreegeoipGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('FreegeoipGeocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    // WS endpoint
    FreegeoipGeocoder.prototype._endpoint = 'http://freegeoip.net/json/';

    /**
    * Geocode
    * @param <string>   value    Value to geocode (IP only)
    * @param <function> callback Callback method
    */
    FreegeoipGeocoder.prototype.geocode = function(value, callback) {

        if (!net.isIP(value)) {
            throw new Error('FreegeoipGeocoder suport only ip geocoding');
        }
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

    /**
    * Reverse geocoding unsupported
    */
    FreegeoipGeocoder.prototype.reverse = function(lat, lng, callback) {
        throw new Error('FreegeoipGeocoder no support reverse geocoding');
    };

    module.exports = FreegeoipGeocoder;


})();