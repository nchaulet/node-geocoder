var util                  = require('util'),
    OpenStreetMapGeocoder = require('./openstreetmapgeocoder');

/**
 * Constructor
 */
var NominatimMapquestGeocoder = function NominatimMapquestGeocoder(httpAdapter, options) {
    NominatimMapquestGeocoder.super_.call(this, httpAdapter, options);
};

util.inherits(NominatimMapquestGeocoder, OpenStreetMapGeocoder);

NominatimMapquestGeocoder.prototype._endpoint = 'http://open.mapquestapi.com/nominatim/v1';
NominatimMapquestGeocoder.prototype._endpoint = 'http://open.mapquestapi.com/nominatim/v1/search';


module.exports = NominatimMapquestGeocoder;
