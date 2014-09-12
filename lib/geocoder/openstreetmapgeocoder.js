var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var OpenStreetMapGeocoder = function(httpAdapter, options) {
    this.name = 'OpenStreetMapGeocoder';
    this.options = ['language'];

    OpenStreetMapGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(OpenStreetMapGeocoder, AbstractGeocoder);

OpenStreetMapGeocoder.prototype._endpoint = 'http://nominatim.openstreetmap.org/search';

OpenStreetMapGeocoder.prototype._endpoint_reverse = 'http://nominatim.openstreetmap.org/reverse';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
OpenStreetMapGeocoder.prototype._geocode = function(value, callback) {
    var _this = this;

    var params = this._getCommonParams();
    params.addressdetails = 1;
    params.q = value;

    this.httpAdapter.get(this._endpoint , params, function(err, result) {
        if (err) {
            return callback(err);
        } else {

            var results = [];

            for (var i = 0; i < result.length; i++) {
                results.push(_this._formatResult(result[i]));
            }

            callback(false, results);
        }

    });

};

OpenStreetMapGeocoder.prototype._formatResult = function(result) {

    return {
        'latitude' : result.lat,
        'longitude' : result.lon,
        'country' : result.address.country,
        'city' : result.address.city,
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
OpenStreetMapGeocoder.prototype._reverse = function(lat, lng, callback) {

    var _this = this;

    var params = this._getCommonParams();
    params.lat = lat;
    params.lon = lng;
    this.httpAdapter.get(this._endpoint_reverse , params, function(err, result) {
        if (err) {
            throw err;
        } else {
            var results = [];
            if(result.error != 'undefined') {
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
OpenStreetMapGeocoder.prototype._getCommonParams = function(){
    var params = {};
    params.format = 'json';

    if (this.options.language) {
        params['accept-language'] = this.options.language;
    }

    return params;
};

module.exports = OpenStreetMapGeocoder;
