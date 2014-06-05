var net    = require('net');

var AbstractGeocoder = function() {
	this.name = 'abstract';
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
	};
	
	return this._reverse(lat, lng, callback);	
};

/**
* Geocode
* @param <string>   value    Value to geocode (Adress)
* @param <function> callback Callback method
*/
AbstractGeocoder.prototype.geocode = function(value, callback) {
	if (!typeof this._geocode == 'function') {
		throw new Error(this.name + ' no support geocoding');
	}
	if (net.isIP(value) && (!this.supportIp || this.suportIp == 'undefined')) {
        throw new Error(this.name + ' no suport geocoding ip');
    }

	return this._geocode(value, callback);	
};

module.exports = AbstractGeocoder;