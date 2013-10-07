(function () {

        var Geocoder = function (geocoder, formater) {
            this._geocoder = geocoder;
            this._formater = formater;
        };

        Geocoder.prototype.geocode = function (value, callback) {
            var _this = this;
            this._geocoder.geocode(value, function(err, data) { _this._format(err, data, callback); });
        };

        Geocoder.prototype.reverse = function (lat, long, callback) {
            this._geocoder.reverse(lat, long, function(err, data) { _this._format(err, data, callback); });
        };

        Geocoder.prototype._format = function (err, data, callback) {

            if (err) {
                callback(err, data);

                return;
            }

            callback(err, data);
        };

        module.exports = Geocoder;
}());