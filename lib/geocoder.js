(function () {

        var Geocoder = function(geocoder) {
            this.geocoder = geocoder;
        };

        Geocoder.prototype.geocode = function(value, callback) {
            this.geocoder.geocode(value, callback);
        };

        Geocoder.prototype.reverse = function(lat, long, callback) {
            this.geocoder.reverse(lat, long, callback);
        };

        module.exports = Geocoder;

}());