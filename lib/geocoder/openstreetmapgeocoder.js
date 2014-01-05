'use strict';
(function () {

    var net = require('net');

    /**
     * Constructor
     */
    var OpenStreetMapGeocoder = function(httpAdapter) {

        if (!httpAdapter || httpAdapter == 'undefinded') {

            throw new Error('OpenStreetMapGeocoder need an httpAdapter');
        }

        this.httpAdapter = httpAdapter;
    };

    OpenStreetMapGeocoder.prototype._endpoint = 'http://nominatim.openstreetmap.org/search';

    /**
    * Geocode
    * @param <string>   value    Value to geocode (Adress)
    * @param <function> callback Callback method
    */
    OpenStreetMapGeocoder.prototype.geocode = function(value, callback) {

        if (net.isIP(value)) {
            throw new Error('OpenStreetMapGeocoder no suport geocoding ip');
        }
        var _this = this;

        this.httpAdapter.get(this._endpoint , {'q' : value, 'format' : 'json','addressdetails' : 1}, function(err, result) {
            if (err) {
                throw err;
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
    OpenStreetMapGeocoder.prototype.reverse = function(lat, lng, callback) {

        var _this = this;

        this.httpAdapter.get(this._endpoint , { lat : lat, lon :  lng, format : 'json'}, function(err, result) {
            if (err) {
                throw err;
            } else {
                var results = [];

                if(result.length > 0) {
                    results.push(_this._formatResult(result[0]));
                }

                callback(false, results);
            }
        });
    };

    module.exports = OpenStreetMapGeocoder;

})();