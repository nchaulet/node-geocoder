(function () {

        var Geocoder = function (geocoder, formatter) {
            this._geocoder = geocoder;
            this._formatter = formatter;
        };

        Geocoder.prototype.geocode = function (value, callback) {
            var _this = this;
            this._geocoder.geocode(value, function(err, data) { _this._format(err, data, callback); });
        };

        Geocoder.prototype.reverse = function (lat, long, callback) {
            var _this = this;
            this._geocoder.reverse(lat, long, function(err, data) { _this._format(err, data, callback); });
        };

        Geocoder.prototype._format = function (err, data, callback) {
            if (err) {
                callback(err, data);

                return;
            }

            if (this._formatter && this._formatter !== 'undefined') {
                data = this._formatter.format(data);
            }
            
            callback(err, data);
        };

        module.exports = Geocoder;
}());