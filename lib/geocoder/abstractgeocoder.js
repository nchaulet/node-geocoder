var net    = require('net');

/**
 * AbstractGeocoder Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options
 */
var AbstractGeocoder = function(httpAdapter, options) {
	if (!this.name || this.name == 'undefinded') {
		throw new Error('this.name must be defined');
	}

	if (!httpAdapter || httpAdapter == 'undefinded') {
        throw new Error(this.name + ' need an httpAdapter');
    }
    this.httpAdapter = httpAdapter;

    if (!options || options == 'undefinded') {
        options = {};
    }
    this.options = options;
};

AbstractGeocoder.prototype.name = 'AbstractGeocoder';

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
* @param <string>   value    Value to geocode (Adress)
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.geocode = function(value, callback) {
	if (typeof this._geocode != 'function') {
		throw new Error(this.name + ' no support geocoding');
	}
	if (net.isIP(value) && (!this.supportIp || this.suportIp == 'undefined')) {
        throw new Error(this.name + ' no suport geocoding ip');
    }

	return this._geocode(value, callback);	
};

module.exports = AbstractGeocoder;