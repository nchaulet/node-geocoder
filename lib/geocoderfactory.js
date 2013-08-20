(function() {

	var Geocoder = require('./geocoder.js');

	var GeocoderFactory = {

		_getHttpAdapter: function(adapterName) {

			if (adapterName === 'requestify') {
				var RequestifyAdapter = new require('./httpadapter/requestifyadapter.js');

				return new RequestifyAdapter();
			}

			var HttpAdapter = new require('./httpadapter/httpadapter.js');

			return new HttpAdapter();
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
		},
		getGeocoder: function(geocoderName, adapterName, geocoderOpts) {

			var adapter = null;
			if (adapterName !== null && adapterName !== 'undefined') {
				adapter = this._getHttpAdapter(adapterName);
			}

			var geocoderAdapter = null;
			if (geocoderName !== null && geocoderName !== 'undefined') {
				geocoderAdapter = this._getGeocoder(geocoderName, adapter);
			}

			var geocoder = new Geocoder(geocoderAdapter);

			return geocoder;
		}

	};

	module.exports = GeocoderFactory;

})();