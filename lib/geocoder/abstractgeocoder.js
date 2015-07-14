var net        = require('net'),
    ValueError = require('../error/valueerror.js');

/**
 * AbstractGeocoder Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options
 */
var AbstractGeocoder = function(httpAdapter, options) {
    if (!this.constructor.name) {
        throw new Error('The Constructor must be named');
    }

    if (!httpAdapter || httpAdapter == 'undefined') {
        throw new Error(this.constructor.name + ' need an httpAdapter');
    }
    this.httpAdapter = httpAdapter;

    if (!options || options == 'undefined') {
        options = {};
    }

    if (this.options) {
        this.options.forEach(function(option) {
            if (!options[option] || options[option] == 'undefined') {
                options[option] = null;
            }
        });
    }

    this.options = options;
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.reverse = function(query, callback) {
    if (typeof this._reverse != 'function') {
        throw new Error(this.constructor.name + ' no support reverse geocoding');
    }

    return this._reverse(query, callback);
};

/**
* Geocode
* @param <string>   value    Value to geocode
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.geocode = function(value, callback) {
    if (typeof this._geocode != 'function') {
        throw new ValueError(this.constructor.name + ' does not support geocoding');
    }
    if (net.isIPv4(value) && (!this.supportIPv4 || this.supportIPv4 == 'undefined')) {
        throw new ValueError(this.constructor.name + ' does not support geocoding IPv4');
    }

    if (net.isIPv6(value) && (!this.supportIPv6 || this.supportIPv6 == 'undefined')) {
        throw new ValueError(this.constructor.name + ' does not support geocoding IPv6');
    }

    if (this.supportAddress === false && (!net.isIPv4(value) && !net.isIPv6(value))) {
        throw new ValueError(this.constructor.name + ' does not support geocoding address');
    }

    return this._geocode(value, callback);
};

module.exports = AbstractGeocoder;
