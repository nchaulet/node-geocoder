var util                  = require('util'),
  OpenStreetMapGeocoder   = require('./openstreetmapgeocoder');

/**
 * Constructor
 */
var PickPointGeocoder = function PickPointGeocoder(httpAdapter, options) {
  PickPointGeocoder.super_.call(this, httpAdapter, options);

  if (!httpAdapter.supportsHttps()) {
    throw new Error('You must use https http adapter');
  }

  if (!this.options.apiKey || this.options.apiKey == 'undefined') {
    throw new Error(this.constructor.name + ' needs an apiKey');
  }

  this.options.key = this.options.apiKey;
};

util.inherits(PickPointGeocoder, OpenStreetMapGeocoder);

PickPointGeocoder.prototype._endpoint = 'https://api.pickpoint.io/v1/forward';
PickPointGeocoder.prototype._endpoint_reverse = 'https://api.pickpoint.io/v1/reverse';

module.exports = PickPointGeocoder;
