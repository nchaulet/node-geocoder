var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var NominatimMapquestGeocoder = function(httpAdapter, options) {
    this.name = 'NominatimMapquestGeocoder';
    this.options = ['language'];

    NominatimMapquestGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(NominatimMapquestGeocoder, AbstractGeocoder);

NominatimMapquestGeocoder.prototype._endpoint = 'http://open.mapquestapi.com/nominatim/v1';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
NominatimMapquestGeocoder.prototype._geocode = function(value, callback) {
    var _this = this;

    var params = this._getCommonParams();
    params.addressdetails = 1;
    params.q = value;

    this.httpAdapter.get(this._endpoint + '/search.php', params, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            var results = [];

			if (result instanceof Array) {
				for (var i = 0; i < result.length; i++) {
					results.push(_this._formatResult(result[i]));
				}
			} else {
				results.push(_this._formatResult(result));
			}

            callback(false, results);
        }

    });

};

NominatimMapquestGeocoder.prototype._formatResult = function(result) {

    return {
        'latitude' : result.lat,
        'longitude' : result.lon,
        'country' : result.address.country,
        'city' : result.address.city,
        'state' : result.address.state,
        'zipcode' : result.address.postcode,
        'streetName': result.address.road,
        'streetNumber' : result.address.house_number,
        'countryCode' : result.address.country_code

    };
};

/**
* Reverse geocoding
* @param <integer>  lat      Latittude
* @param <integer>  lng      Longitude
* @param <function> callback Callback method
*/
NominatimMapquestGeocoder.prototype._reverse = function(lat, lng, callback) {

    var _this = this;

    var params = this._getCommonParams();
    params.lat = lat;
    params.lon = lng;
    this.httpAdapter.get(this._endpoint + '/reverse.php', params, function(err, result) {
        if (err) {
            throw err;
        } else {
            var results = [];

			if (result instanceof Array) {
				for (var i = 0; i < result.length; i++) {
					results.push(_this._formatResult(result[i]));
				}
			} else {
				results.push(_this._formatResult(result));
			}

            callback(false, results);
        }
    });
};

/**
* Prepare common params
*
* @return <Object> common params
*/
NominatimMapquestGeocoder.prototype._getCommonParams = function(){
    var params = {};
    params.format = 'json';

    if (this.options.language) {
        params['accept-language'] = this.options.language;
    }

    return params;
};

module.exports = NominatimMapquestGeocoder;
