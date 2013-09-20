(function () {

        var Geocoder = function(geocoder) {
            this._geocoder = geocoder;
        };

        Geocoder.prototype.geocode = function(value, callback) {
            this._geocoder.geocode(value, callback);
        };

        Geocoder.prototype.reverse = function(lat, long, callback) {
            this._geocoder.reverse(lat, long, callback);
        };

        module.exports = Geocoder;

}());