var Q = require("q");

/**
* Constructor
* @param <object> geocoder  Geocoder Adapter
* @param <object> formatter Formatter adapter or null
*/
var Geocoder = function (geocoder, formatter) {
    this._geocoder = geocoder;
    this._formatter = formatter;
};

/**
* Geocode a value (address or ip)
* @param <string>   value    Value to geocoder (address or IP)
* @param <function> callback Callback method
*/
Geocoder.prototype.geocode = function (value, callback) {
    var deferred = Q.defer(),
        _this    = this;

    this._geocoder.geocode(value, function(err, data) {

        _this._format(err, data, function(err, data) {
            if (callback && callback != 'undefined') {
                callback(err, data);
            }

            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
    });

    return deferred.promise;
};

/**
* Reverse geocoding
* @param <number> lat  Latitude
* @param <number> long Longitude
*/
Geocoder.prototype.reverse = function (lat, long, callback) {
    var deferred = Q.defer(),
        _this    = this;

    this._geocoder.reverse(lat, long, function(err, data) {
        _this._format(err, data, function(err, data) {
            if (callback && callback != 'undefined') {
                callback(err, data);
            }

            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
    });

    return deferred.promise;
};

Geocoder.prototype._format = function (err, data, callback) {

    if (err) {
        return callback(err, data);
    }

    if (this._formatter && this._formatter !== 'undefined') {
        data = this._formatter.format(data);
    }

    callback(err, data);
};

module.exports = Geocoder;
