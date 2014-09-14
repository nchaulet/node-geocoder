# node-geocoder

[![Build Status](https://travis-ci.org/nchaulet/node-geocoder.png?branch=master)](https://travis-ci.org/nchaulet/node-geocoder)

Node library for geocoding and reverse geocoding. Can be used as a nodejs library or on command line

## Installation and usage (geocoder command line)

```shell
npm install -g node-geocoder
geocoder --provider google 'Fornino, 187 Bedford Ave, Brooklyn, NY 11211'
```

## Installation (nodejs library)

    npm install node-geocoder

## Usage example

```javascript
var geocoderProvider = 'google';
var httpAdapter = 'http';
// optionnal
var extra = {
    apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

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
    state: 'Île de France',
    stateCode: 'IDF'
}]

## Advanced usage (only google provider)
geocoder.geocode({address: '29 champs elysée', country: 'France', zipcode: '75008'}, function(err, res) {
    console.log(res);
});

// Reverse example

// Using callback
geocoder.reverse(45.767, 4.833, function(err, res) {
    console.log(res);
});

// Or using Promise
geocoder.reverse(45.767, 4.833)
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        console.log(err);
    });

```

## Geocoder Provider

* `google` : GoogleGeocoder. Supports address geocoding and reverse geocoding. Use `extra.clientId`and `extra.apiKey`(privateKey) for business licence. You can also use `extra.language` to specify language. Note that 'https' is required when using an apiKey
* `freegeoip` : FreegeoipGeocoder. Supports IP geocoding
* `datasciencetoolkit` : DataScienceToolkitGeocoder. Supports IPv4 geocoding and address geocoding. Use `extra.host` to specify a local instance
* `openstreetmap` : OpenStreetMapGeocoder. Supports address geocoding and reverse geocoding
* `mapquest` : MapQuestGeocoder. Supports address geocoding and reverse geocoding. Needs an apiKey
* `openmapquest` : Open MapQuestGeocoder (based on OpenStreetMapGeocoder). Supports address geocoding and reverse geocoding. Needs an apiKey
* `agol` : ArcGis Online Geocoding service. Supports geocoding and reverse. Requires a client_id & client_secret
* `tomtom`: TomTomGeocoder. Supports address geocoding. You need to specify `extra.apiKey`
* `nominatimmapquest`: OpenStreetMap Nominatim geocoder. Support address and reverse geocoding
* `opencage`: OpenCage Geocoder. Uses multiple open sources. Supports address and reverse geocoding. You need to specify `extra.apiKey`
* `smartyStreet`: Smarty street geocoder, need to specify `extra.auth_id`and extra.auth_token`

## Http adapter

* `http`: This adapter uses the Http nodejs library (default)
* `https`: This adapter uses the Https nodejs library

## Formatter

* `gpx`    : format result using GPX format
* `string` : format result to an String array (you need to specify `extra.formatterPattern` key)
    * `%P` country
    * `%p` country code
    * `%n` street number
    * `%S` street name
    * `%z` zip code
    * `%T` State
    * `%t` state code

## More

You can improve this project by adding new geocoders or http adapters.

To run tests just `npm test`.

To check code style install `jshint` and just run `jshint lib test`.

### Extending node geocoder

You can add new geocoders by implementing the two methods `geocode` and `reverse`:

```javascript
var geocoder = {
    geocode: function(value, callback) { },
    reverse: function(lat, lng, callback) { }
}
```

You can also add formatter implementing the following interface

```javascript
var formatter = {
    format: function(data) { return formattedData; },
}
```
