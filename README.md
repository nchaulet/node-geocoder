# node-geocoder

[![Build Status](https://img.shields.io/travis/nchaulet/node-geocoder.svg?style=flat-square)](https://travis-ci.org/nchaulet/node-geocoder)
![Dependencycy status](https://img.shields.io/david/nchaulet/node-geocoder.svg?style=flat-square)
[![npm version](https://img.shields.io/npm/v/node-geocoder.svg?style=flat-square)](https://www.npmjs.com/package/node-geocoder)


Node library for geocoding and reverse geocoding. Can be used as a nodejs library

## Installation (nodejs library)

    npm install node-geocoder

## Usage example

```javascript
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// Using callback
geocoder.geocode('29 champs elysée paris', function(err, res) {
  console.log(res);
});

// Or using Promise
geocoder.geocode('29 champs elysée paris')
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });

// output :
[{
  latitude: 48.8698679,
  longitude: 2.3072976,
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  zipcode: '75008',
  streetName: 'Champs-Élysées',
  streetNumber: '29',
  administrativeLevels: {
    level1long: 'Île-de-France',
    level1short: 'IDF',
    level2long: 'Paris',
    level2short: '75'
  },
  provider: 'google'
}]
```

## Advanced usage (only google, here, mapquest, locationiq, and opencage providers)

```javascript
geocoder.geocode({address: '29 champs elysée', country: 'France', zipcode: '75008'}, function(err, res) {
  console.log(res);
});

// OpenCage advanced usage example
geocoder.geocode({address: '29 champs elysée', countryCode: 'fr', minConfidence: 0.5, limit: 5}, function(err, res) {
  console.log(res);
});

// Reverse example

// Using callback
geocoder.reverse({lat:45.767, lon:4.833}, function(err, res) {
  console.log(res);
});

// Or using Promise
geocoder.reverse({lat:45.767, lon:4.833})
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });

// Batch geocode

geocoder.batchGeocode(['13 rue sainte catherine', 'another adress'], function (err, results) {
  // Return an array of type {error: false, value: []}
  console.log(results) ;
});

// Set specific http request headers:
var HttpsAdapter = require('node-geocoder/lib/httpadapter/httpsadapter.js')
var httpAdapter = new HttpsAdapter(null, {
  headers: {
    'user-agent': 'My application <email@domain.com>',
    'X-Specific-Header': 'Specific value'
  }
});

var geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: httpAdapter
});
```

## Geocoder Provider

* `google` : GoogleGeocoder. Supports address geocoding and reverse geocoding. Use `options.clientId`and `options.apiKey`(privateKey) for business licence. You can also use `options.language` and `options.region` to specify language and region, respectively. Note that 'https' is required when using an apiKey
* `here` : HereGeocoder. Supports address geocoding and reverse geocoding. You must specify `options.appId` and `options.appCode` with your license keys. You can also use `options.language`, `options.politicalView` ([read about political views here](https://developer.here.com/rest-apis/documentation/geocoder/topics/political-views.html)), `options.country`, and `options.state`.
* `freegeoip` : FreegeoipGeocoder. Supports IP geocoding
* `datasciencetoolkit` : DataScienceToolkitGeocoder. Supports IPv4 geocoding and address geocoding. Use `options.host` to specify a local instance
* `openstreetmap` : OpenStreetMapGeocoder. Supports address geocoding and reverse geocoding. You can use `options.language` and `options.email` to specify a language and a contact email address.
  * For `geocode`, you can use an object as value, specifying one or several parameters from https://wiki.openstreetmap.org/wiki/Nominatim#Parameters
  * For `reverse`, you can use additional parameters from https://wiki.openstreetmap.org/wiki/Nominatim#Parameters_2
  * You should specify a specific `user-agent` or `referrer` header field as required by
  https://wiki.openstreetmap.org/wiki/Nominatim_usage_policy
* `locationiq` : LocationIQGeocoder. Supports address geocoding and reverse geocoding just like openstreetmap but does require only a locationiq api key to be set.
  * For `geocode` you can use simple `q` parameter or an object containing th edifferent parameters defined here: http://locationiq.org/#docs
  * For `reverse`, you can pass over `{lat, lon}` and additional parameters defined in http://locationiq.org/#docs
  * No need to specify referer or email addresses, just locationiq api key, note that there are rate limits!
* `mapquest` : MapQuestGeocoder. Supports address geocoding and reverse geocoding. Needs an apiKey
* `openmapquest` : Open MapQuestGeocoder (based on OpenStreetMapGeocoder). Supports address geocoding and reverse geocoding. Needs an apiKey
* `agol` : ArcGis Online Geocoding service. Supports geocoding and reverse. Requires a client_id & client_secret and 'https' http adapter
* `tomtom`: TomTomGeocoder. Supports address geocoding. You need to specify `options.apiKey`
* `nominatimmapquest`: Same geocoder as `openstreetmap`, but queries the MapQuest servers. You need to specify `options.apiKey`
* `opencage`: OpenCage Geocoder. Uses multiple open sources. Supports address and reverse geocoding. You need to specify `options.apiKey`
* `smartyStreet`: Smarty street geocoder (US only), you need to specify `options.auth_id` and `options.auth_token`
* `geocodio`: Geocodio, Supports address geocoding and reverse geocoding (US only)
* `yandex`: Yandex support address geocoding, you can use `options.language` to specify language
* `teleport`: Teleport supports city and urban area forward and reverse geocoding; for more information, see [Teleport API documentation](https://developers.teleport.org/api/)
* `opendatafrance`: OpendataFranceGeocoder supports forward and reverse geocoding in France; for more information, see [OpendataFrance API documentation](https://adresse.data.gouv.fr/api/)
* `pickpoint`: PickPoint Geocoder. Supports address geocoding and reverse geocoding. You need to specify `options.apiKey` obtained at [PickPoint](https://pickpoint.io). `https` is required.
  * As parameter for `geocode` function you can use a string representing an address like "13 rue sainte catherine" or an object with parameters described in [Forward Geocoding Reference](https://pickpoint.io/api-reference#forward-geocoding). 
  * For `geocode` function you should use an object where `{lat, lon}` are required parameters. Additional parameters like `zoom` are available, see details in [Reverse Geocoding Reference](https://pickpoint.io/api-reference#reverse-geocoding).


## Http adapter

* `https`: This adapter uses the Https nodejs library (default)
* `http`: This adapter uses the Http nodejs library
* `phin`: This adapter uses the phin nodejs library

You can specify request timeout using paramater `options.timeout`

## Formatter

* `gpx`    : format result using GPX format
* `string` : format result to an String array (you need to specify `options.formatterPattern` key)
    * `%P` country
    * `%p` country code
    * `%n` street number
    * `%S` street name
    * `%z` zip code
    * `%T` State
    * `%t` state code

## More

### Playground

You can try node-geocoder here http://node-geocoder.herokuapp.com/

### Command line tools

[`node-geocoder-cli`](https://github.com/nchaulet/node-geocoder-cli) You can use node-geocoder-cli to geocode in shell

### Extending node geocoder

You can add new geocoders by implementing the two methods `geocode` and `reverse`:

```javascript
var geocoder = {
    geocode: function(value, callback) { ... },
    reverse: function(query, callback) { var lat = query.lat; var lon = query.lon; ... }
}
```

You can also add formatter implementing the following interface

```javascript
var formatter = {
    format: function(data) { return formattedData; },
}
```
### Contributing

You can improve this project by adding new geocoders or http adapters.

To run tests just `npm test`.

To check code style just run `npm run lint`.
