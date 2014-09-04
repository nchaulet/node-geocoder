var crypto           = require('crypto'),
    url              = require('url'),
    util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var GoogleGeocoder = function(httpAdapter, options) {
    this.name    = 'GoogleGeocoder';
    this.options = ['language', 'apiKey', 'clientId'];

    GoogleGeocoder.super_.call(this, httpAdapter, options);

    if (this.options.clientId && !this.options.apiKey) {
        throw new Error('You must specify a apiKey (privateKey)');
    }
};

util.inherits(GoogleGeocoder, AbstractGeocoder);

// Google geocoding API endpoint
GoogleGeocoder.prototype._endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
GoogleGeocoder.prototype._geocode = function(value, callback) {
    
    var _this = this;
    var params = this._prepareQueryString();

    if (value.address && value.address != 'undefinded') {
        var components = '';

        if (value.country && value.country != 'undefinded') {
            components += 'country:'+ value.country;
        }

        if (value.zipcode && value.zipcode != 'undefinded') {
            components += '|postal_code:'+ value.zipcode;
        }

        params.components = components;
        params.address = value.address;
    } else {
        params.address = value;    
    }

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
    } else if (this.options.apiKey) {
        params.key = this.options.apiKey;
    }

    return params;
};

GoogleGeocoder.prototype._signedRequest = function(endpoint, params) {
    if (this.options.clientId) {
        var request = url.parse(endpoint);
        var fullRequestPath = request.path + url.format({ query: params });
        var decodedKey = new Buffer(this.options.apiKey.replace('-', '+').replace('_', '/'), 'base64').toString('binary');
        var hmac = crypto.createHmac('sha1', decodedKey);
        hmac.update(fullRequestPath);
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
        // Address
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
GoogleGeocoder.prototype._reverse = function(lat, lng, callback) {

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
