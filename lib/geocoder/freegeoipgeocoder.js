'use strict';
(function () {

    var iz = require('iz');

    /**
     * Constructor
     */
    var FreegeoipGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('FreegeoipGeocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    FreegeoipGeocoder.prototype._endpoint = 'http://freegeoip.net/json/';

    FreegeoipGeocoder.prototype.geocode = function(value, callback) {

        if (!iz.ip(value)) {
            throw new Error('FreegeoipGeocoder suport only ip geocoding');
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint + value , { }, function(err, result) {
            if (err) {
                throw err;
            } else {

                var results = [];

                results.push({
                    'latitude' : result.latitude,
                    'longitude' : result.longitude,
                    'country' : result.country_name,
                    'city' : result.city,
                    'zipcode' : null,
                    'streetName': null,
                    'streetNumber' : null,
                    'countryCode' : result.country_code

                });

                callback(false, results);
            }

        });

    };


    FreegeoipGeocoder.prototype.reverse = function(lat, lng, callback) {
        throw new Error('FreegeoipGeocoder no support reverse geocoding');
    };

    module.exports = FreegeoipGeocoder;


})();