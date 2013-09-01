'use strict';
(function () {

    var net = require('net');

    /**
     * Constructor
     */
    var GoogleGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('Google Geocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    GoogleGeocoder.prototype._endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

    GoogleGeocoder.prototype.geocode = function(value, callback) {

        if (net.isIP(value)) {
            throw new Error('Google Geocoder no suport geocoding ip');
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint , { 'address' : value, 'sensor' : false}, function(err, result) {
            if (err) {
                throw err;
            } else {
                var results = [];

                for(var i = 0; i < result.results.length; i++) {
                    results.push(_this._formatResult(result.results[i]));
                }

                callback(false, results);
            }

        });

    };

    GoogleGeocoder.prototype._formatResult = function(result) {

        var country = null;
        var countryCode = null;
        var city = null;
        var zipcode = null;
        var streetName = null;
        var streetNumber = null;


        for (var i = 0; i < result.address_components.length; i++) {
            // Country
            if (result.address_components[i].types.indexOf('country') >= 0) {
                country = result.address_components[i].long_name;
            }
            if (result.address_components[i].types.indexOf('country') >= 0) {
                countryCode = result.address_components[i].short_name;
            }
            // City
            if (result.address_components[i].types.indexOf('locality') >= 0) {
                city = result.address_components[i].long_name;
            }
            //
            if (result.address_components[i].types.indexOf('postal_code') >= 0) {
                zipcode = result.address_components[i].long_name;
            }
            if (result.address_components[i].types.indexOf('route') >= 0) {
                streetName = result.address_components[i].long_name;
            }
            if (result.address_components[i].types.indexOf('street_number') >= 0) {
                streetNumber = result.address_components[i].long_name;
            }
        }

        return {
            'latitude' : result.geometry.location.lat,
            'longitude' : result.geometry.location.lng,
            'country' : country,
            'city' : city,
            'zipcode' : zipcode,
            'streetName': streetName,
            'streetNumber' : streetNumber,
            'countryCode' : countryCode

        };
    };

    GoogleGeocoder.prototype.reverse = function(lat, lng, callback) {

        var _this = this;

        this.httpAdapter.get(this._endpoint , { 'latlng' : lat + ',' + lng, 'sensor' : false}, function(err, result) {
            if (err) {
                throw err;
            } else {
                var results = [];

                if(result.results.length > 0) {
                    results.push(_this._formatResult(result.results[0]));
                }

                callback(false, results);
            }
        });
    };

    module.exports = GoogleGeocoder;


})();