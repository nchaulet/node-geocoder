# node-geocoder

[![Build Status](https://travis-ci.org/nchaulet/node-geocoder.png?branch=master)](https://travis-ci.org/nchaulet/node-geocoder)

Node library for geocoding and reverse geocoding

Currently in development

## Installation

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

geocoder.geocode('29 champs elysée paris', function(err, res) {
    console.log(res);
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
```

## Geocoder Provider

* `google` : GoogleGeocoder support address geocoding and reverse geocoding, use `extra.clientId`and `extra.apiKey`(privateKey)for business licence, you can also use `extra.language` for specify language
* `freegeoip` : FreegeoipGeocoder support ip geocoding
* `datasciencetoolkit` : DataScienceToolkitGeocoder supports ip v4 geocoding and address geocoding
* `openstreetmap` : OpenStreetMapGeocoder support address geocoding and reverse geocoding
* `mapquest` : MapQuestGeocoder support address geocoding and reverse geocoding need an apiKey

## Http adapter

* `http`       : This adapter uses Http nodejs library (by default)
* `requestify` : This adapter uses Requestify library (you need to install `requestify`)

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

### Extending node geocoder

You can add new geocoders by implementing the two method geocode & reverse:

```javascript
var geocoder = {
    geocode: function(value, callback) { },
    reverse: function(lat, lng, callback) { }
}
```

## Changelog

### 1.1.0

* add google geocoder language option

### 1.2.0

* add openStreetmap geocoder language option
* improve http error handling
