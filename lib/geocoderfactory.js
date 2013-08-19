(function() {

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
		},
		getGeocoder: function(geocoderName, adapterName, geocoderOpts) {

			var adapter = null;
			if (adapterName !== null && adapterName !== 'undefined') {
				adapter = this._getHttpAdapter(adapterName);
			}

			var geocoder = null;
			if (geocoderName !== null && geocoderName !== 'undefined') {
				geocoder = this._getGeocoder(geocoderName, adapter);
			}

			return geocoder;
		}

	};

	module.exports = GeocoderFactory;

})();