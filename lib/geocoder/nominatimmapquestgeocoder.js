var util                  = require('util'),
    OpenStreetMapGeocoder = require('./openstreetmapgeocoder');

/**
 * Constructor
 */
var NominatimMapquestGeocoder = function NominatimMapquestGeocoder(httpAdapter, options) {
    NominatimMapquestGeocoder.super_.call(this, httpAdapter, options);

    if (!this.options.apiKey || this.options.apiKey == 'undefined') {
      throw new Error(this.constructor.name + ' needs an apiKey');
    }
    this.options.key = this.options.apiKey;
    delete this.options.apiKey;
};

util.inherits(NominatimMapquestGeocoder, OpenStreetMapGeocoder);

NominatimMapquestGeocoder.prototype._endpoint = 'http://open.mapquestapi.com/nominatim/v1/search';
NominatimMapquestGeocoder.prototype._endpoint_reverse = 'http://open.mapquestapi.com/nominatim/v1/reverse';


module.exports = NominatimMapquestGeocoder;
