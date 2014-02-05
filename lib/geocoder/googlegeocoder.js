'use strict';
(function () {

    var net    = require('net'),
        crypto = require('crypto'),
        url    = require('url');

    /**
     * Constructor
     * @param <object> httpAdapter Http Adapter
     * @param <object> options     Options (language, clientId, apiKey)
     */
    var GoogleGeocoder = function(httpAdapter, options) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('Google Geocoder need an httpAdapter');
        }

        if (!options || options == 'undefinded') {
            options = {};
        }

        if (!options.language || options.language == 'undefinded') {
            options.language = null;
        }

        if (!options.apiKey || options.apiKey == 'undefinded') {
            options.apiKey = null;
        }

        if (!options.clientId || options.clientId == 'undefinded') {
            options.clientId = null;
        }

        if (options.clientId && !options.apiKey) {

            throw new Error('You must specify a apiKey (privateKey)');
        }

        this.options = options;

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

        var params = this._prepareQueryString();
        params.address = value;
        this._signedRequest(this._endpoint, params);
        this.httpAdapter.get(this._endpoint, params, function(err, result) {
            if (err) {
                return callback(err);
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

    GoogleGeocoder.prototype._prepareQueryString = function() {
        var params = {
            'sensor' : false
        };

        if (this.options.language) {
            params.language = this.options.language;
        }

        if (this.options.clientId) {
            params.client = this.options.clientId;
        }

        return params;
    };

    GoogleGeocoder.prototype._signedRequest = function(endpoint, params) {
        if (this.options.clientId) {
            var request = url.parse(endpoint);
            request.query = params;
            request = url.parse(url.format(request));
            request.path = '/maps/api/geocode/json?address=blah&sensor=false&client=foo';
            var decodedKey = new Buffer(this.options.apiKey.replace('-', '+').replace('_', '/'), 'base64').toString('binary');
            var hmac = crypto.createHmac('sha1', decodedKey);
            hmac.update(request.path);
            var signature = hmac.digest('base64');

            signature = signature.replace('+', '-').replace('/', '_');

            params.signature = signature;
        }

        return params;
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
        var params = this._prepareQueryString();
        params.latlng = lat + ',' + lng;
        this._signedRequest(this._endpoint, params);
        this.httpAdapter.get(this._endpoint , params, function(err, result) {
            if (err) {
                return callback(err);
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
