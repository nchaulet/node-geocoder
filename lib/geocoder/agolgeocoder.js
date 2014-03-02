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

        if (!httpAdapter.requestify) {

            throw new Error('The AGOL geocoder requires HTTPS support that is available in requestify');
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
    AGOLGeocoder.prototype._endpoint = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find";
    AGOLGeocoder.prototype._reverseEndpoint = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";

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
        var _this = this;

        if (net.isIP(value)) {
            throw new Error('The AGOL geocoder does not support IP addresses');
        }

        if (value instanceof Array) {
            //As defined in http://resources.arcgis.com/en/help/arcgis-rest-api/#/Batch_geocoding/02r300000003000000/
            throw new Error('An ArcGIS Online organizational account is required to use the batch geocoding functionality');
        }

        var execute = function (value,token,callback) {
            var params = {
                'token':token,
                'f':"json",
                'text':value,
                'outFields': 'AddrNum,StPreDir,StName,StType,City,Postal,Region,Country'
            }
            _this.httpAdapter.get(_this._endpoint, params, function(err, result) {
                result = JSON.parse(result);
                if (err) {
                    return callback(err);
                } else {

                    //This is to work around ESRI's habit of returning 200 OK for failures such as lack of authentication
                    if(result.error){
                        throw(new Error(result.error));
                        return;
                    }

                    var results = [];
                    for(var i = 0; i < result.locations.length; i++) {
                        results.push(_this._formatResult(result.locations[i]));
                    }

                    callback(false, results);
                }
            });
        };

        this._getToken(function(err,token) {
            if (err) {
                return callback(err);
            } else {
                execute(value,token,callback);
            }
        });
    };

    AGOLGeocoder.prototype._formatResult = function(result) {
        if(result.address){
            return {
                'latitude' : result.location.x,
                'longitude' : result.location.y,
                'country' : result.address.CountryCode,
                'city' : result.address.City,
                'state' : result.address.Region,
                'zipcode' : result.address.Postal,
                'countryCode' : result.address.CountryCode,
                'address': result.address.Address,
                'neighborhood': result.address.Neighborhood,
                'loc_name': result.address.Loc_name
            }
        }

        var country = null;
        var countryCode = null;
        var city = null;
        var state = null;
        var stateCode = null;
        var zipcode = null;
        var streetPreDir = null;
        var streetType = null;
        var streetName = null;
        var streetNumber = null;

        var attributes = result.feature.attributes;
        for (var property in attributes) {
            if (attributes.hasOwnProperty(property)) {
                if(property == "City")
                    city = attributes[property];
                if(property == "Postal")
                    zipcode = attributes[property];
                if(property == "Region")
                    state = attributes[property];
                if(property == "StPreDir")
                    streetPreDir = attributes[property];
                if(property == "AddrNum")
                    streetNumber = attributes[property];
                if(property == "StName")
                    streetName = attributes[property];
                if(property == "StType")
                    streetType = attributes[property];
                if(property == "Country")
                    countryCode = attributes[property];
                if(property == "Country")
                    country = attributes[property];
                if(property == "Country")
                    country = attributes[property];
            }
        }

        return {
            'latitude' : result.feature.geometry.x,
            'longitude' : result.feature.geometry.y,
            'country' : country,
            'city' : city,
            'state' : state,
            'stateCode' : stateCode,
            'zipcode' : zipcode,
            'streetName': streetPreDir + ' ' + streetName + ' ' + streetType,
            'streetNumber' : streetNumber,
            'countryCode' : countryCode

        };
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
