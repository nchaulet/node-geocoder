'use strict';
(function () {

    var net = require('net');

    /**
     * Constructor
     * @param <object> httpAdapter Http Adapter
     */
    var GoogleGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('Google Geocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    // Google geocoding API endpoint
    GoogleGeocoder.prototype._endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

    /**
    * Geocode
    * @param <string>   value    Value to geocode (Adress)
    * @param <function> callback Callback method
    */
    GoogleGeocoder.prototype.geocode = function(value, callback) {

        if (net.isIP(value)) {
            throw new Error('Google Geocoder no suport geocoding ip');
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint , { 'address' : value, 'sensor' : false}, function(err, result) {
            if (err) {
                throw err;
            } else {
                // status can be "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", or "UNKNOWN_ERROR"
                // error_message may or may not be present
                if (result.status !== 'OK') {
                    return callback(new Error('Status is ' + result.status + '.' + (result.error_message ? ' ' + result.error_message : '')));
                }

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
        var state = null;
        var stateCode = null;
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
            // State
            if (result.address_components[i].types.indexOf('administrative_area_level_1') >= 0) {
                state = result.address_components[i].long_name;
            }
            if (result.address_components[i].types.indexOf('administrative_area_level_1') >= 0) {
                stateCode = result.address_components[i].short_name;
            }
            // City
            if (result.address_components[i].types.indexOf('locality') >= 0) {
                city = result.address_components[i].long_name;
            }
            // Adress
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
            'state' : state,
            'stateCode' : stateCode,
            'zipcode' : zipcode,
            'streetName': streetName,
            'streetNumber' : streetNumber,
            'countryCode' : countryCode

        };
    };

    /**
    * Reverse geocoding
    * @param <integer>  lat      Latittude
    * @param <integer>  lng      Longitude
    * @param <function> callback Callback method
    */
    GoogleGeocoder.prototype.reverse = function(lat, lng, callback) {

        var _this = this;

        this.httpAdapter.get(this._endpoint , { 'latlng' : lat + ',' + lng, 'sensor' : false}, function(err, result) {
            if (err) {
                throw err;
            } else {
                // status can be "OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", or "UNKNOWN_ERROR"
                // error_message may or may not be present
                if (result.status !== 'OK') {
                    return callback(new Error('Status is ' + result.status + '.' + (result.error_message ? ' ' + result.error_message : '')));
                }

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
