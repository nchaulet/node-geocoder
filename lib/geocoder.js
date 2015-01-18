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
        if (err) {
            if (callback && callback != 'undefined') {
                return callback(err, data);
            }
            return deferred.reject(err)
        }

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
        if (err) {
            if (callback && callback != 'undefined') {
                return callback(err, data);
            }
            return deferred.reject(err)
        }
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
* Batch geocode
* @param <array>    values    array of Values to geocode (address or IP)
* @param <function> callback
*
* @return promise
*/
Geocoder.prototype.batchGeocode = function(values, callback) {
    var promises = values.map(function(value) {
        return this.geocode(value);
    }, this);

    return Q.allSettled(promises)
        .then(function(results) {

            results = results.map(function(result) {
                if (result.state == 'fulfilled') {
                    return {
                        error: false,
                        value: result.value
                    };
                }

                return {
                    error: result.reason,
                    value: null
                };
            });

            if (callback && callback != 'undefined') {
                callback(false, results);
            }

            return results;
        }, function(err) {
            if (callback && callback != 'undefined') {
                callback(err);
            }

            return err;
        });
};

Geocoder.prototype._format = function (err, data, callback) {

    if (err) {
        return callback(err, data);
    }

    if (this._formatter && this._formatter !== 'undefined') {
        try {
            data = this._formatter.format(data);
        } catch(err) {
            return callback(err)
        }
    }

    callback(err, data);
};

module.exports = Geocoder;
