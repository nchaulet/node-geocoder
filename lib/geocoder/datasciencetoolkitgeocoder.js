'use strict';
(function () {

    var net = require('net');

    /**
     * Constructor
     */
    var DataScienceToolkitGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('DataScienceToolkitGeocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    DataScienceToolkitGeocoder.prototype._ipv4Endpoint = 'http://www.datasciencetoolkit.org/ip2coordinates/';
    DataScienceToolkitGeocoder.prototype._street2coordinatesEndpoint = 'http://www.datasciencetoolkit.org/street2coordinates/';
    DataScienceToolkitGeocoder.prototype._endpoint = DataScienceToolkitGeocoder.prototype._ipv4Endpoint;

    DataScienceToolkitGeocoder.prototype.geocode = function(value, callback) {

        if (!net.isIPv4(value)) {
            this._endpoint = this._street2coordinatesEndpoint;
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint + value , { }, function(err, result) {
            if (err) {
                throw err;
            } else {
                result = result[value];

                if (!result) {
                    return callback(new Error('Could not geocode "' + value + '".'));
                }

                var results = [];

                results.push({
                    'latitude' : result.latitude,
                    'longitude' : result.longitude,
                    'country' : result.country_name,
                    'city' : result.city || result.locality,
                    'zipcode' : result.postal_code,
                    'streetName': result.street_name,
                    'streetNumber' : result.street_number,
                    'countryCode' : result.country_code
                });

                callback(false, results);
            }

        });

    };


    DataScienceToolkitGeocoder.prototype.reverse = function(lat, lng, callback) {
        throw new Error('DataScienceToolkitGeocoder no support reverse geocoding');
    };

    module.exports = DataScienceToolkitGeocoder;


})();
