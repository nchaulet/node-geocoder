# node-geocoder

[![Build Status](https://travis-ci.org/nchaulet/node-geocoder.png?branch=master)](https://travis-ci.org/nchaulet/node-geocoder)

Node library for geocoding and reverse geocoding. Can be use as a nodejs library or as a command line

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
    apiKey: 'YOUR_API_KEY', // for map quest
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
    .err(function(err) {
        console.log(err);
    });

```

## Geocoder Provider

* `google` : GoogleGeocoder support address geocoding and reverse geocoding, use `extra.clientId`and `extra.apiKey`(privateKey)for business licence, you can also use `extra.language` for specify language
* `freegeoip` : FreegeoipGeocoder support ip geocoding
* `datasciencetoolkit` : DataScienceToolkitGeocoder supports ip v4 geocoding and address geocoding, use `extra.host` for specify a local instance
* `openstreetmap` : OpenStreetMapGeocoder support address geocoding and reverse geocoding
* `mapquest` : MapQuestGeocoder support address geocoding and reverse geocoding need an apiKey
* `openmapquest` : Open MapQuestGeocoder (based on OpenStreetMapGeocoder) support address geocoding and reverse geocoding need an apiKey
* `agol` : ArcGis Online Geocoding service, supports geocoding and reverse.  Requires a client_id & client_secret
* `tomtom`: TomTomGeocoder support address geocoding , you need to specify `extra.apiKey`

## Http adapter

* `http`: This adapter uses Http nodejs library (by default)
* `https`: This adapter uses Https nodejs library

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

To run tests just `npm test`

To check code style install `jshint` and just run `jshint lib test

### Extending node geocoder

You can add new geocoders by implementing the two method geocode & reverse:

```javascript
var geocoder = {
    geocode: function(value, callback) { },
    reverse: function(lat, lng, callback) { }
}
```

You can also add formatter implementing this interface

```javascript
var formatter = {
    format: function(data) { return formattedData; },
}
```
