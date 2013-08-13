'use strict';
(function () {

	var iz = require('iz');

	/**
	 * Constructor
	 */
	var GoogleAdapter = function(httpAdapter) {

		if (!httpAdapter || httpAdapter == 'undefinded') {

			throw new Error('GoogleAdapter need an httpAdapter');
		}

		this.httpAdapter = httpAdapter;
	};

	GoogleAdapter.prototype._endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

	GoogleAdapter.prototype.geocode = function(value, callback) {

		if (iz.ip(value)) {
			callback( new Error('Google adapter no suport geocoding ip'));

			return;
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

	GoogleAdapter.prototype._formatResult = function(result) {

		var country = null;
		var city = null;
		var zipcode = null;

		for (var i = 0; i < result.address_components.length; i++) {
			if (result.address_components[i].types.indexOf('country') >= 0) {
				country = result.address_components[i].long_name;
			}

			if (result.address_components[i].types.indexOf('locality') >= 0) {
				city = result.address_components[i].long_name;
			}

			if (result.address_components[i].types.indexOf('postal_code') >= 0) {
				zipcode = result.address_components[i].long_name;
			}
		}

		return {
			'lat' : result.geometry.location.lat,
			'lng' : result.geometry.location.lng,
			'country' : country,
			'city' : city,
			'zipcode' : zipcode

		};
	};

	GoogleAdapter.prototype.reverse = function(lat, lng) {

	};

	module.exports = GoogleAdapter;


})();