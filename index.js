'use strict';

const GeocoderFactory = require('./lib/geocoderfactory.js');

const Exports = GeocoderFactory.getGeocoder.bind(GeocoderFactory);

module.exports = Exports;
