'use strict';

import type Geocoder from './lib/geocoder';
import GeocoderFactory from './lib/geocoderfactory';

// const GeocoderFactory = require('./lib/geocoderfactory.js');

export type { Geocoder };

// TODO: types options
export function getGeocoder(geocoderAdapter: string, options: any): Geocoder {
  return GeocoderFactory.getGeocoder(geocoderAdapter, options);
}
