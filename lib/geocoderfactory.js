(function() {

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
		_getHttpAdapter: function(adapterName) {

			if (adapterName === 'http') {
				var HttpAdapter = new require('./httpadapter/httpadapter.js');

				return new HttpAdapter(require('http'));
			}

			if (adapterName === 'https') {
				var HttpsAdapter = new require('./httpadapter/httpadapter.js');

				return new HttpsAdapter(require('https'));
			}
		},
		/**
		* Return a geocoder adapter by name
		* @param  <string> adapterName adapter name
		* @return <object>
		*/
		_getGeocoder: function(geocoderName, adapter, extra) {
			if (geocoderName === 'google') {
				var GoogleGeocoder = new require('./geocoder/googlegeocoder.js');

				return new GoogleGeocoder(adapter, {clientId: extra.clientId, apiKey: extra.apiKey, language: extra.language});
			}
            if (geocoderName === 'agol') {
                var AGOLGeocoder = new require('./geocoder/agolgeocoder.js');

                return new AGOLGeocoder(adapter, {client_id:extra.client_id, client_secret:extra.client_secret});
            }
			if (geocoderName === 'freegeoip') {
				var FreegeoipGeocoder = new require('./geocoder/freegeoipgeocoder.js');

				return new FreegeoipGeocoder(adapter);
			}
			if (geocoderName === 'datasciencetoolkit') {
				var DataScienceToolkitGeocoder = new require('./geocoder/datasciencetoolkitgeocoder.js');

				return new DataScienceToolkitGeocoder(adapter, {host: extra.host});
			}
			if (geocoderName === 'openstreetmap') {
				var OpenStreetMapGeocoder = new require('./geocoder/openstreetmapgeocoder.js');

				return new OpenStreetMapGeocoder(adapter, {language: extra.language});
			}
			if (geocoderName === 'mapquest') {
				var MapQuestGeocoder = new require('./geocoder/mapquestgeocoder.js');

				return new MapQuestGeocoder(adapter, extra.apiKey);
			}
			if (geocoderName === 'openmapquest') {
				var OpenMapQuestGeocoder = new require('./geocoder/openmapquestgeocoder.js');

				return new OpenMapQuestGeocoder(adapter, extra.apiKey);
			}
			if (geocoderName === 'nominatimmapquest') {
				var NominatimMapquestGeocoder = new require('./geocoder/nominatimmapquestgeocoder.js');

				return new NominatimMapquestGeocoder(adapter, {language: extra.language});
			}
			if (geocoderName === 'tomtom') {
				var TomTomGeocoder = new require('./geocoder/tomtomgeocoder.js');

				return new TomTomGeocoder(adapter, {apiKey: extra.apiKey});
			}
      if (geocoderName === 'smartystreets') {
        var SmartyStreets = new require('./geocoder/smartystreetsgeocoder.js');

        return new SmartyStreets(adapter, extra.auth_id, extra.auth_token);
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
				var GpxFormatter = new require('./formatter/gpxformatter.js');

				return new GpxFormatter();
			}

			if (formatterName === 'string') {
				var StringFormatter = new require('./formatter/stringformatter.js');

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

			if (!httpAdapter || httpAdapter === 'undefined') {
				httpAdapter = 'http';
			}

			if (!extra || extra == 'undefinded') {
				extra = {};
			}

			if (Helper.isString(httpAdapter)) {
				httpAdapter = this._getHttpAdapter(httpAdapter);
			}

			if (Helper.isString(geocoderAdapter)) {
				geocoderAdapter = this._getGeocoder(geocoderAdapter, httpAdapter, extra);
			}

			formatter = extra.formatter;

			if (Helper.isString(formatter)) {
				formatter = this._getFormatter(formatter, extra);
			}

			var geocoder = new Geocoder(geocoderAdapter, formatter);

			return geocoder;
		}

	};

	module.exports = GeocoderFactory;

})();
