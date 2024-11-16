'use strict';

import type Geocoder from './lib/geocoder';
import { GeocoderFactory, type GeocoderName } from './lib/geocoderfactory';

export type { Geocoder, GeocoderName };

// TODO: types options
export function getGeocoder(provider: GeocoderName, options: any): Geocoder {
  return GeocoderFactory.getGeocoder(provider, options);
}
