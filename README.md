# node-geocoder

[![Build Status](https://travis-ci.org/nchaulet/node-geocoder.png?branch=master)](https://travis-ci.org/nchaulet/node-geocoder)

Node library for geocoding and reverse geocoding

Currently in development

## instalation

    npm install node-geocoder
    

## Geocoder Provider

* `google` : GoogleGeocoder support adress geocoding and reverse geocoding
* `freegeoip` : FreegeoipGeocoder support ip geocoding
* `datasciencetoolkit` : DataScienceToolkitGeocoder support ip v4 geocoding
* `openstreetmap` : OpenStreetMapGeocoder support adress geocoding and reverse geocoding
* `mapquest` : MapQuestGeocoder support adress geocoding and reverse geocoding need an apiKey

## Http adapter

* `http`       : This adapter use Http nodejs library (by default)
* `requestify` : This adapter use Requestify library (you need to install `requestify`)

## Formatter

* `gpx` : format result using GPX format 

## Usage example

    var geocoderProvider = 'google';
    var httpAdapter = 'http';
    // optionnal
    var extra = {
        apiKey: 'YOUR_API_KEY',
        formatter: null
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
        streetNumber: '29'
    }]


## More

You can improve this project by adding new geocoder or http adapter

For run tests just `npm test`

## Extending node geocoder

you can add new geocoder by implementing the two method geocode & reverse :


    var geocoder = {
        geocode: function(value, callback) { },
        reverse: function(lat, lng, callback) { }
    }

## Roadmap

add results formating
more documentation
more provider
