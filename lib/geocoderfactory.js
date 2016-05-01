'use strict';

var Helper = require('./helper.js');
var Geocoder = require('./geocoder.js');

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
      var HttpAdapter = require('./httpadapter/httpadapter.js');

      return new HttpAdapter(null, options);
    }

    if (adapterName === 'https') {
      var HttpsAdapter = require('./httpadapter/httpsadapter.js');

      return new HttpsAdapter(null, options);
    }
  },
  /**
  * Return a geocoder adapter by name
  * @param  <string> adapterName adapter name
  * @return <object>
  */
  _getGeocoder: function(geocoderName, adapter, extra) {
    if (geocoderName === 'google') {
      var GoogleGeocoder = require('./geocoder/googlegeocoder.js');

      return new GoogleGeocoder(adapter, {clientId: extra.clientId, apiKey: extra.apiKey, language: extra.language, region: extra.region, excludePartialMatches: extra.excludePartialMatches, channel: extra.channel});
    }
    if (geocoderName === 'here') {
      var HereGeocoder = require('./geocoder/heregeocoder.js');

      return new HereGeocoder(adapter, {appId: extra.appId, appCode: extra.appCode, language: extra.language, politicalView: extra.politicalView, country: extra.country, state: extra.state});
    }
    if (geocoderName === 'agol') {
      var AGOLGeocoder = require('./geocoder/agolgeocoder.js');

      return new AGOLGeocoder(adapter, {client_id: extra.client_id, client_secret: extra.client_secret});
    }
    if (geocoderName === 'freegeoip') {
      var FreegeoipGeocoder = require('./geocoder/freegeoipgeocoder.js');

      return new FreegeoipGeocoder(adapter);
    }
    if (geocoderName === 'datasciencetoolkit') {
      var DataScienceToolkitGeocoder = require('./geocoder/datasciencetoolkitgeocoder.js');

      return new DataScienceToolkitGeocoder(adapter, {host: extra.host});
    }
    if (geocoderName === 'openstreetmap') {
      var OpenStreetMapGeocoder = require('./geocoder/openstreetmapgeocoder.js');

      return new OpenStreetMapGeocoder(adapter, {language: extra.language});
    }
    if (geocoderName === 'mapquest') {
      var MapQuestGeocoder = require('./geocoder/mapquestgeocoder.js');

      return new MapQuestGeocoder(adapter, extra.apiKey);
    }
    if (geocoderName === 'openmapquest') {
      var OpenMapQuestGeocoder = require('./geocoder/openmapquestgeocoder.js');

      return new OpenMapQuestGeocoder(adapter, extra.apiKey);
    }

    if (geocoderName === 'yandex') {
      var YandexGeocoder = require('./geocoder/yandexgeocoder.js');

      return new YandexGeocoder(adapter, {language: extra.language});
    }

    if (geocoderName === 'geocodio') {
      var GeocodioGeocoder = require('./geocoder/geocodiogeocoder.js');

      return new GeocodioGeocoder(adapter, extra.apiKey);
    }

    if (geocoderName === 'opencage') {
      var OpenCageGeocoder = require('./geocoder/opencagegeocoder.js');

      return new OpenCageGeocoder(adapter, extra.apiKey, extra);
    }

    if (geocoderName === 'nominatimmapquest') {
      var NominatimMapquestGeocoder = require('./geocoder/nominatimmapquestgeocoder.js');

      return new NominatimMapquestGeocoder(adapter, {language: extra.language, apiKey: extra.apiKey});
    }
    if (geocoderName === 'tomtom') {
      var TomTomGeocoder = require('./geocoder/tomtomgeocoder.js');

      return new TomTomGeocoder(adapter, {apiKey: extra.apiKey});
    }
    if (geocoderName === 'smartystreets') {
      var SmartyStreets = require('./geocoder/smartystreetsgeocoder.js');

      return new SmartyStreets(adapter, extra.auth_id, extra.auth_token);
    }
    if (geocoderName === 'teleport') {
      var TeleportGeocoder = require('./geocoder/teleportgeocoder.js');

      return new TeleportGeocoder(adapter, extra.apiKey, extra);
    }
    if (geocoderName === 'opendatafrance') {
      var OpendataFranceGeocoder = require('./geocoder/opendatafrancegeocoder.js');

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

    var geocoder = new Geocoder(geocoderAdapter, formatter);

    return geocoder;
  }
};

module.exports = GeocoderFactory;
