var util             = require('util'),
    net              = require('net'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var DataScienceToolkitGeocoder = function DataScienceToolkitGeocoder(httpAdapter,options) {
    this.options     = ['host'];
    this.supportIPv4 = true;

    DataScienceToolkitGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(DataScienceToolkitGeocoder, AbstractGeocoder);

/**
* Build DSTK endpoint, allows for local DSTK installs
* @param <string>   value    Value to geocode (Address or IPv4)
*/
DataScienceToolkitGeocoder.prototype._endpoint = function(value) {
   var ep = { };
   var host = 'www.datasciencetoolkit.org';

   if(this.options.host) {
        host =  this.options.host;
    }

    ep.ipv4Endpoint = 'http://' + host + '/ip2coordinates/';
    ep.street2coordinatesEndpoint = 'http://' + host + '/street2coordinates/';

    return net.isIPv4(value) ? ep.ipv4Endpoint : ep.street2coordinatesEndpoint;
};

/**
* Geocode
* @param <string>   value    Value to geocode (Address or IPv4)
* @param <function> callback Callback method
*/
DataScienceToolkitGeocoder.prototype._geocode = function(value, callback) {

    var ep = this._endpoint(value);
    this.httpAdapter.get(ep + value , { }, function(err, result) {
        if (err) {
            return callback(err);
        } else {
            result = result[value];
            if (!result) {
                return callback(new Error('Could not geocode "' + value + '".'));
            }

            var results = [];

            results.push({
                'latitude' : result.latitude,
                'longitude' : result.longitude,
                'country' : result.country_name,
                'city' : result.city || result.locality,
                'zipcode' : result.postal_code,
                'streetName': result.street_name,
                'streetNumber' : result.street_number,
                'countryCode' : result.country_code
            });

            results.raw = result;
            callback(false, results);
        }

    });

};

module.exports = DataScienceToolkitGeocoder;
