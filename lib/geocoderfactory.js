'use strict';

const Helper = require('./helper.js');
const Geocoder = require('./geocoder.js');

const FetchAdapter = require('./httpadapter/fetchadapter.js');

const GoogleGeocoder = require('./geocoder/googlegeocoder.js');
const HereGeocoder = require('./geocoder/heregeocoder.js');
const AGOLGeocoder = require('./geocoder/agolgeocoder.js');
const FreegeoipGeocoder = require('./geocoder/freegeoipgeocoder.js');
const DataScienceToolkitGeocoder = require('./geocoder/datasciencetoolkitgeocoder.js');
const OpenStreetMapGeocoder = require('./geocoder/openstreetmapgeocoder.js');
const PickPointGeocoder = require('./geocoder/pickpointgeocoder.js');
const LocationIQGeocoder = require('./geocoder/locationiqgeocoder.js');
const MapQuestGeocoder = require('./geocoder/mapquestgeocoder.js');
const MapzenGeocoder = require('./geocoder/mapzengeocoder.js');
const OpenMapQuestGeocoder = require('./geocoder/openmapquestgeocoder.js');
const YandexGeocoder = require('./geocoder/yandexgeocoder.js');
const GeocodioGeocoder = require('./geocoder/geocodiogeocoder.js');
const OpenCageGeocoder = require('./geocoder/opencagegeocoder.js');
const NominatimMapquestGeocoder = require('./geocoder/nominatimmapquestgeocoder.js');
const TomTomGeocoder = require('./geocoder/tomtomgeocoder.js');
const VirtualEarthGeocoder = require('./geocoder/virtualearth.js');
const SmartyStreets = require('./geocoder/smartystreetsgeocoder.js');
const TeleportGeocoder = require('./geocoder/teleportgeocoder.js');
const OpendataFranceGeocoder = require('./geocoder/opendatafrancegeocoder.js');
const MapBoxGeocoder = require('./geocoder/mapboxgeocoder.js');
const APlaceGeocoder = require('./geocoder/aplacegeocoder.js');

/**
 * Geocoder Facotry
 */
const GeocoderFactory = {
  /**
   * Return an http adapter by name
   * @param  <string> adapterName adapter name
   * @return <object>
   */
  _getHttpAdapter: function (adapterName, options) {
    if (adapterName === 'fetch') {
      return new FetchAdapter(options);
    }
  },
  /**
   * Return a geocoder adapter by name
   * @param  <string> adapterName adapter name
   * @return <object>
   */
  _getGeocoder: function (geocoderName, adapter, extra) {
    if (geocoderName === 'google') {
      return new GoogleGeocoder(adapter, {
        clientId: extra.clientId,
        apiKey: extra.apiKey,
        language: extra.language,
        region: extra.region,
        excludePartialMatches: extra.excludePartialMatches,
        channel: extra.channel
      });
    }
    if (geocoderName === 'here') {
      return new HereGeocoder(adapter, {
        apiKey: extra.apiKey,
        appId: extra.appId,
        appCode: extra.appCode,
        language: extra.language,
        politicalView: extra.politicalView,
        country: extra.country,
        state: extra.state,
        production: extra.production,
        limit: extra.limit
      });
    }
    if (geocoderName === 'agol') {
      return new AGOLGeocoder(adapter, {
        client_id: extra.client_id,
        client_secret: extra.client_secret
      });
    }
    if (geocoderName === 'freegeoip') {
      return new FreegeoipGeocoder(adapter);
    }
    if (geocoderName === 'datasciencetoolkit') {
      return new DataScienceToolkitGeocoder(adapter, { host: extra.host });
    }
    if (geocoderName === 'openstreetmap') {
      return new OpenStreetMapGeocoder(adapter, {
        language: extra.language,
        osmServer: extra.osmServer
      });
    }
    if (geocoderName === 'pickpoint') {
      return new PickPointGeocoder(adapter, {
        language: extra.language,
        apiKey: extra.apiKey
      });
    }
    if (geocoderName === 'locationiq') {
      return new LocationIQGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'mapquest') {
      return new MapQuestGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'mapzen') {
      return new MapzenGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'openmapquest') {
      return new OpenMapQuestGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'yandex') {
      return new YandexGeocoder(adapter, {
        apiKey: extra.apiKey,
        language: extra.language,
        results: extra.results,
        skip: extra.skip,
        kind: extra.kind,
        bbox: extra.bbox,
        rspn: extra.rspn
      });
    }
    if (geocoderName === 'geocodio') {
      return new GeocodioGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'opencage') {
      return new OpenCageGeocoder(adapter, extra.apiKey, extra);
    }
    if (geocoderName === 'nominatimmapquest') {
      return new NominatimMapquestGeocoder(adapter, {
        language: extra.language,
        apiKey: extra.apiKey
      });
    }
    if (geocoderName === 'tomtom') {
      return new TomTomGeocoder(adapter, {
        apiKey: extra.apiKey,
        country: extra.country,
        limit: extra.limit
      });
    }
    if (geocoderName === 'virtualearth') {
      return new VirtualEarthGeocoder(adapter, { apiKey: extra.apiKey });
    }
    if (geocoderName === 'smartystreets') {
      return new SmartyStreets(adapter, extra.auth_id, extra.auth_token);
    }
    if (geocoderName === 'teleport') {
      return new TeleportGeocoder(adapter, extra.apiKey, extra);
    }
    if (geocoderName === 'opendatafrance') {
      return new OpendataFranceGeocoder(adapter);
    }
    if (geocoderName === 'mapbox') {
      return new MapBoxGeocoder(adapter, extra);
    }
    if (geocoderName === 'aplace') {
      return new APlaceGeocoder(adapter, extra);
    }
    throw new Error('No geocoder provider find for : ' + geocoderName);
  },
  /**
   * Return an formatter adapter by name
   * @param  <string> adapterName adapter name
   * @return <object>
   */
  _getFormatter: function (formatterName, extra) {
    if (formatterName === 'gpx') {
      var GpxFormatter = require('./formatter/gpxformatter.js');

      return new GpxFormatter();
    }

    if (formatterName === 'string') {
      var StringFormatter = require('./formatter/stringformatter.js');

      return new StringFormatter(extra.formatterPattern);
    }
  },
  /**
   * Return a geocoder
   * @param  <string|object> geocoderAdapter Geocoder adapter name or adapter object
   * @param  <array>         extra           Extra parameters array
   * @return <object>
   */
  getGeocoder: function (geocoderAdapter, extra) {
    if (typeof geocoderAdapter === 'object') {
      extra = geocoderAdapter;
      geocoderAdapter = null;
    }

    if (!extra) {
      extra = {};
    }

    if (extra.provider) {
      geocoderAdapter = extra.provider;
    }

    if (!geocoderAdapter) {
      geocoderAdapter = 'google';
    }

    const httpAdapter = this._getHttpAdapter('fetch', extra);

    if (Helper.isString(geocoderAdapter)) {
      geocoderAdapter = this._getGeocoder(geocoderAdapter, httpAdapter, extra);
    }

    var formatter = extra.formatter;

    if (Helper.isString(formatter)) {
      formatter = this._getFormatter(formatter, extra);
    }

    return new Geocoder(geocoderAdapter, formatter);
  }
};

module.exports = GeocoderFactory;
