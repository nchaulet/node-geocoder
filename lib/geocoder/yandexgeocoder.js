var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var YandexGeocoder = function YandexGeocoder(httpAdapter, options) {

    YandexGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(YandexGeocoder, AbstractGeocoder);

var _findKey = function(result, wantedKey) {
    var val = null;
    Object.keys(result).every(function(key) {

        if (key === wantedKey) {
            val = result[key];
            return false;
        }

        if (typeof result[key] === 'object') {
            val = _findKey(result[key], wantedKey);

            return val === null ? true : false;
        }

        return true;
    });

    return val;
};

var _formatResult = function(result) {
    var position = result.GeoObject.Point.pos.split(' ');
    result = result.GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails;

    return {
        'latitude' : position[0],
        'longitude' : position[1],
        'city' : _findKey(result, 'LocalityName'),
        'state' : _findKey(result, 'AdministrativeAreaName'),
        'streetName': _findKey(result, 'ThoroughfareName'),
        'streetNumber' : _findKey(result, 'PremiseNumber'),
        'countryCode' : _findKey(result, 'CountryNameCode'),
        'country' : _findKey(result, 'CountryName')
    };
};

// Yandex geocoding API endpoint
YandexGeocoder.prototype._endpoint = 'https://geocode-maps.yandex.ru/1.x/';

/**
* Geocode
* @param <string>   value    Value to geocode (Address)
* @param <function> callback Callback method
*/
YandexGeocoder.prototype._geocode = function(value, callback) {
    var params = {
        geocode : value,
        format: 'json'
    };

    if (this.options.language) {
        params.lang = this.options.language;
    }

    this.httpAdapter.get(this._endpoint, params, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            var results = [];

            result.response.GeoObjectCollection.featureMember.forEach(function(geopoint) {
                results.push(_formatResult(geopoint));
            });

            results.raw = result;
            callback(false, results);
        }
    });
};

module.exports = YandexGeocoder;
