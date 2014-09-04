var net    = require('net');

/**
 * AbstractGeocoder Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options
 */
var AbstractGeocoder = function(httpAdapter, options) {
    if (!this.name || this.name == 'undefinded') {
        throw new Error('this.name must be defined in Constructor');
    }

    if (!httpAdapter || httpAdapter == 'undefinded') {
        throw new Error(this.name + ' need an httpAdapter');
    }
    this.httpAdapter = httpAdapter;

    if (!options || options == 'undefinded') {
        options = {};
    }

    if (this.options) {
        this.options.forEach(function(option) {
            if (!options[option] || options[option] == 'undefinded') {
                options[option] = null;
            }
        });
    }

    this.options = options;
};

/**
* Reverse geocoding
* @param <integer>  lat      Latittude
* @param <integer>  lng      Longitude
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.reverse = function(lat, lng, callback) {
    if (typeof this._reverse != 'function') {
        throw new Error(this.name + ' no support reverse geocoding');
    }
    
    return this._reverse(lat, lng, callback);   
};

/**
* Geocode
* @param <string>   value    Value to geocode
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.geocode = function(value, callback) {
    if (typeof this._geocode != 'function') {
        throw new Error(this.name + ' does not support geocoding');
    }
    if (net.isIPv4(value) && (!this.supportIPv4 || this.supportIPv4 == 'undefined')) {
        throw new Error(this.name + ' does not support geocoding IPv4');
    }

    if (net.isIPv6(value) && (!this.supportIPv6 || this.supportIPv6 == 'undefined')) {
        throw new Error(this.name + ' does not support geocoding IPv6');
    }

    if (this.supportAddress === false && (!net.isIPv4(value) && !net.isIPv6(value))) {
        throw new Error(this.name + ' does not support geocoding address');
    }

    return this._geocode(value, callback);  
};

module.exports = AbstractGeocoder;