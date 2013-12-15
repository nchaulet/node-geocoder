(function () {

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
            var _this = this;
            this._geocoder.geocode(value, function(err, data) { _this._format(err, data, callback); });
        };

        /**
        * Reverse geocoding
        * @param <number> lat  Latitude
        * @param <number> long Longitude
        */
        Geocoder.prototype.reverse = function (lat, long, callback) {
            var _this = this;
            this._geocoder.reverse(lat, long, function(err, data) { _this._format(err, data, callback); });
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
}());