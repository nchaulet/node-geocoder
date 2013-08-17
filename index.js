(function() {


	var GeocoderFactory = require('./lib/geocoderfactory.js');

	module.exports = function(geocoderName, adapterName) {

		return GeocoderFactory.getGeocoder(geocoderName, adapterName);
	};
})();