var GoogleAdapter = require ('./lib/geocoder/googlegeocoder.js');

var RequestifyAdapter = require ('./lib/httpadapter/requestifyadapter.js');

var GeocoderFactory = require('./lib/geocoderfactory.js');

var adapter = GeocoderFactory.getGeocoder('google', 'http');

//var adapter = new GoogleAdapter(new RequestifyAdapter());

var adapter =  require ('./index.js')('freegeoip', 'requestify');
// adapter.reverse(48.8698679,2.3072976, function (err, res) {
// 	console.log(err);
// 	console.log(res);
// });
adapter.geocode('81.220.43.134', function(err, res) {
	console.log(err);
	console.log(res);
});
