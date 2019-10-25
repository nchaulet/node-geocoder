'use strict';

var Helper = require('./helper.js');
var Geocoder = require('./geocoder.js');

var HttpAdapter = require('./httpadapter/httpadapter.js');
var HttpsAdapter = require('./httpadapter/httpsadapter.js');
var RequestAdapter = require('./httpadapter/requestadapter.js');

var GoogleGeocoder = require('./geocoder/googlegeocoder.js');
var HereGeocoder = require('./geocoder/heregeocoder.js');
var AGOLGeocoder = require('./geocoder/agolgeocoder.js');
var FreegeoipGeocoder = require('./geocoder/freegeoipgeocoder.js');
var DataScienceToolkitGeocoder = require('./geocoder/datasciencetoolkitgeocoder.js');
var OpenStreetMapGeocoder = require('./geocoder/openstreetmapgeocoder.js');
var PickPointGeocoder = require('./geocoder/pickpointgeocoder.js');
var LocationIQGeocoder = require('./geocoder/locationiqgeocoder.js');
var MapQuestGeocoder = require('./geocoder/mapquestgeocoder.js');
var MapzenGeocoder = require('./geocoder/mapzengeocoder.js');
var OpenMapQuestGeocoder = require('./geocoder/openmapquestgeocoder.js');
var YandexGeocoder = require('./geocoder/yandexgeocoder.js');
var GeocodioGeocoder = require('./geocoder/geocodiogeocoder.js');
var OpenCageGeocoder = require('./geocoder/opencagegeocoder.js');
var NominatimMapquestGeocoder = require('./geocoder/nominatimmapquestgeocoder.js');
var TomTomGeocoder = require('./geocoder/tomtomgeocoder.js');
var VirtualEarthGeocoder = require('./geocoder/virtualearth.js');
var SmartyStreets = require('./geocoder/smartystreetsgeocoder.js');
var TeleportGeocoder = require('./geocoder/teleportgeocoder.js');
var OpendataFranceGeocoder = require('./geocoder/opendatafrancegeocoder.js');

/**
* Geocoder Facotry
*/
var GeocoderFactory = {

  /**
  * Return an http adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getHttpAdapter: function(adapterName, options) {
    if (adapterName === 'http') {
      return new HttpAdapter(null, options);
    }
    if (adapterName === 'https') {
      return new HttpsAdapter(null, options);
    }
    if (adapterName === 'request') {
      return new RequestAdapter(null, options);
    }
  },
  /**
  * Return a geocoder adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getGeocoder: function(geocoderName, adapter, extra) {
    if (geocoderName === 'google') {
      return new GoogleGeocoder(adapter, {clientId: extra.clientId, apiKey: extra.apiKey, language: extra.language, region: extra.region, excludePartialMatches: extra.excludePartialMatches, channel: extra.channel});
    }
    if (geocoderName === 'here') {
      return new HereGeocoder(adapter, {appId: extra.appId, appCode: extra.appCode, language: extra.language, politicalView: extra.politicalView, country: extra.country, state: extra.state, production: extra.production});
    }
    if (geocoderName === 'agol') {
      return new AGOLGeocoder(adapter, {client_id: extra.client_id, client_secret: extra.client_secret});
    }
    if (geocoderName === 'freegeoip') {
      return new FreegeoipGeocoder(adapter);
    }
    if (geocoderName === 'datasciencetoolkit') {
      return new DataScienceToolkitGeocoder(adapter, {host: extra.host});
    }
    if (geocoderName === 'openstreetmap') {
      return new OpenStreetMapGeocoder(adapter, {language: extra.language, osmServer: extra.osmServer});
    }
    if (geocoderName === 'pickpoint') {
      return new PickPointGeocoder(adapter, {language: extra.language, apiKey: extra.apiKey});
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
        skip:  extra.skip,
        kind:  extra.kind,
        bbox:  extra.bbox,
        rspn:  extra.rspn
      });
    }
    if (geocoderName === 'geocodio') {
      return new GeocodioGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'opencage') {
      return new OpenCageGeocoder(adapter, extra.apiKey, extra);
    }
    if (geocoderName === 'nominatimmapquest') {
      return new NominatimMapquestGeocoder(adapter, {language: extra.language, apiKey: extra.apiKey});
    }
    if (geocoderName === 'tomtom') {
      return new TomTomGeocoder(adapter, {apiKey: extra.apiKey});
    }
    if (geocoderName === 'virtualearth') {
      return new VirtualEarthGeocoder(adapter, {apiKey: extra.apiKey});
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

    throw new Error('No geocoder provider find for : ' + geocoderName);
  },
  /**
  * Return an formatter adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getFormatter: function(formatterName, extra) {
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
  * @param  <string|object> httpAdapter     Http adapter name or adapter object
  * @param  <array>         extra           Extra parameters array
  * @return <object>
  */
  getGeocoder: function(geocoderAdapter, httpAdapter, extra) {
    if (typeof geocoderAdapter === 'object') {
      extra = geocoderAdapter;
      geocoderAdapter = null;
      httpAdapter = null;
    }

    if (!extra) {
      extra = {};
    }

    if (extra.httpAdapter) {
      httpAdapter = extra.httpAdapter;
    }

    if (extra.provider) {
      geocoderAdapter = extra.provider;
    }

    if (!httpAdapter) {
      httpAdapter = 'https';
    }

    if (!geocoderAdapter) {
      geocoderAdapter = 'google';
    }

    if (Helper.isString(httpAdapter)) {
      httpAdapter = this._getHttpAdapter(httpAdapter, extra);
    }

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
