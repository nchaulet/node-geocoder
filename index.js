(function() {
	var GeocoderFactory = require('./lib/geocoderfactory.js');

    var Exports = GeocoderFactory.getGeocoder.bind(GeocoderFactory);


    // Should be deprecated in 3.0 @deprecated
    Exports.getGeocoder = GeocoderFactory.getGeocoder.bind(GeocoderFactory);

	module.exports =  Exports;
})();
