var querystring      = require('querystring'),
    util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var MapQuestGeocoder = function MapQuestGeocoder(httpAdapter, apiKey) {

    MapQuestGeocoder.super_.call(this, httpAdapter);

    if (!apiKey || apiKey == 'undefined') {

        throw new Error('MapQuestGeocoder needs an apiKey');
    }

    this.apiKey = apiKey;
};

util.inherits(MapQuestGeocoder, AbstractGeocoder);

MapQuestGeocoder.prototype._endpoint = 'http://www.mapquestapi.com/geocoding/v1';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
MapQuestGeocoder.prototype._geocode = function(value, callback) {

    var _this = this;
    this.httpAdapter.get(this._endpoint + '/address' , { 'location' : value, 'key' : querystring.unescape(this.apiKey)}, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            if (result.info.statuscode !== 0) {
                return callback(new Error('Status is ' + result.info.statuscode + ' ' + result.info.messages[0]),{raw:result});
            }

            var results = [];

            var locations = result.results[0].locations;

            for(var i = 0; i < locations.length; i++) {
                results.push(_this._formatResult(locations[i]));
            }

            results.raw = result;
            callback(false, results);
        }
    });
};

MapQuestGeocoder.prototype._formatResult = function(result) {

    return {
        'latitude' : result.latLng.lat,
        'longitude' : result.latLng.lng,
        'country' : null,
        'city' : result.adminArea5,
        'stateCode' : result.adminArea3,
        'zipcode' : result.postalCode,
        'streetName': result.street,
        'streetNumber' : null,
        'countryCode' : result.adminArea1

    };
};

/**
* Reverse geocoding
* @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
* @param <function> callback Callback method
*/
MapQuestGeocoder.prototype._reverse = function(query, callback) {
    var lat = query.lat;
    var lng = query.lon;

    var _this = this;

    this.httpAdapter.get(this._endpoint + '/reverse' , { 'location' : lat + ',' + lng, 'key' : querystring.unescape(this.apiKey)}, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            var results = [];

            var locations = result.results[0].locations;

            for(var i = 0; i < locations.length; i++) {
                results.push(_this._formatResult(locations[i]));
            }

            results.raw = result;
            callback(false, results);
        }
    });
};

module.exports = MapQuestGeocoder;
