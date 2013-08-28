'use strict';
(function () {

    var Helper = require('../helper.js');

    /**
     * Constructor
     */
    var DataScienceToolkitGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('DataScienceToolkitGeocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    DataScienceToolkitGeocoder.prototype._endpoint = 'http://www.datasciencetoolkit.org/ip2coordinates/';

    DataScienceToolkitGeocoder.prototype.geocode = function(value, callback) {

        if (!Helper.isIp(value)) {
            throw new Error('DataScienceToolkitGeocoder suport only ip geocoding');
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint + value , { }, function(err, result) {
            if (err) {
                throw err;
            } else {
                result = result[value];

                var results = [];

                results.push({
                    'latitude' : result.latitude,
                    'longitude' : result.longitude,
                    'country' : result.country_name,
                    'city' : result.locality,
                    'zipcode' : null,
                    'streetName': null,
                    'streetNumber' : null,
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