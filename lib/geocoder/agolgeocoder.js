'use strict';
(function () {
    var net    = require('net');
    /**
     * Constructor
     * @param {Object} httpAdapter Http Adapter
     * @param {Object} options     Options (language, client_id, client_secret)
     */
    var AGOLGeocoder = function(httpAdapter, options) {

        if (!httpAdapter || httpAdapter == 'undefined') {

            throw new Error('ArcGis Online Geocoder requires a httpAdapter to be defined');
        }

        if (!options || options == 'undefined') {
            options = {};
        }

        if (!options.client_id || options.client_id == 'undefined') {
            options.client_id = null;
        }

        if (!options.client_secret || options.client_secret == 'undefined') {
            options.client_secret = null;
        }

        if (!options.client_secret || !options.client_id) {

            throw new Error('You must specify the client_id and the client_secret');
        }

        this.options = options;

        this.httpAdapter = httpAdapter;
    };

    AGOLGeocoder.prototype._authEndpoint = "https://www.arcgis.com/sharing/oauth2/token";

    AGOLGeocoder.prototype._prepareAuthQueryString = function() {
        var params = {
            'client_id': this.options.client_id,
            'grant_type': 'client_credentials',
            'client_secret': this.options.client_secret
        }

        return params;
    };

    AGOLGeocoder.prototype._tokenExpiration = -1;

    AGOLGeocoder.prototype._token = function() {
        var _this = this;

        var params = this._prepareAuthQueryString();
        this.httpAdapter.get(this._authEndpoint, params, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                console.log(result);

                var results = [];
                callback(false, results);
            }
        });

    }

    /**
     * Geocode
     * @param {String}   value    Value to geocode (Address)
     * @param {Function} callback Callback method
     */
    AGOLGeocoder.prototype.geocode = function(value, callback) {
        if (net.isIP(value)) {
            throw new Error('The AGOL geocoder does not support IP addresses');
        }
    };

    AGOLGeocoder.prototype._formatResult = function(result) {

        var country = null;
        var countryCode = null;
        var city = null;
        var state = null;
        var stateCode = null;
        var zipcode = null;
        var streetName = null;
        var streetNumber = null;


    }

    /**
     * Reverse geocoding
     * @param <integer>  lat      Latittude
     * @param <integer>  lng      Longitude
     * @param <function> callback Callback method
     */
    AGOLGeocoder.prototype.reverse = function(lat, lng, callback) {

    };

    module.exports = AGOLGeocoder;

})();
