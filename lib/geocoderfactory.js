(function() {

	var Helper = require('./helper.js');

	var Geocoder = require('./geocoder.js');

	var GeocoderFactory = {

		_getHttpAdapter: function(adapterName) {

			if (adapterName === 'requestify') {
				var RequestifyAdapter = new require('./httpadapter/requestifyadapter.js');

				return new RequestifyAdapter();
			}

			if (adapterName === 'http') {
				var HttpAdapter = new require('./httpadapter/httpadapter.js');

				return new HttpAdapter();
			}
		},
		_getGeocoder: function(geocoderName, adapter, extra) {
			if (geocoderName === 'google') {
				var GoogleGeocoder = new require('./geocoder/googlegeocoder.js');

				return new GoogleGeocoder(adapter);
			}
			if (geocoderName === 'freegeoip') {
				var FreegeoipGeocoder = new require('./geocoder/freegeoipgeocoder.js');

				return new FreegeoipGeocoder(adapter);
			}
			if (geocoderName === 'datasciencetoolkit') {
				var DataScienceToolkitGeocoder = new require('./geocoder/datasciencetoolkitgeocoder.js');

				return new DataScienceToolkitGeocoder(adapter);
			}
			if (geocoderName === 'openstreetmap') {
				var OpenStreetMapGeocoder = new require('./geocoder/openstreetmapgeocoder.js');

				return new OpenStreetMapGeocoder(adapter);
			}
			if (geocoderName === 'mapquest') {
				var MapQuestGeocoder = new require('./geocoder/mapquestgeocoder.js');

				return new MapQuestGeocoder(adapter, extra.apiKey);
			}
		},
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