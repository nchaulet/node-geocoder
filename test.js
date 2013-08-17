var GoogleAdapter = require ('./lib/geocoder/googlegeocoder.js');

var RequestifyAdapter = require ('./lib/httpadapter/requestifyadapter.js');

var GeocoderFactory = require('./lib/geocoderfactory.js');

var adapter = GeocoderFactory.getGeocoder('google', 'requestify');

//var adapter = new GoogleAdapter(new RequestifyAdapter());

var adapter =  require ('./index.js')('google', 'requestify');

adapter.geocode('29 champs elysée paris', function(err, res) {
	console.log(err);
	console.log(res);
});
