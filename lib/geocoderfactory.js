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
		_getGeocoder: function(geocoderName, adapter) {
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
		},
		getGeocoder: function(geocoderAdapter, httpAdapter, geocoderOpts) {

			if (!httpAdapter || httpAdapter === 'undefined') {
				httpAdapter = 'http';
			}

			if (Helper.isString(httpAdapter)) {
				httpAdapter = this._getHttpAdapter(httpAdapter);
			}

			if (Helper.isString(geocoderAdapter)) {
				geocoderAdapter = this._getGeocoder(geocoderAdapter, httpAdapter);
			}

			var geocoder = new Geocoder(geocoderAdapter);

			return geocoder;
		}

	};

	module.exports = GeocoderFactory;

})();