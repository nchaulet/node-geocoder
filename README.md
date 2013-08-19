# node-geocoder

[![Build Status](https://travis-ci.org/nchaulet/node-geocoder.png?branch=master)](https://travis-ci.org/nchaulet/node-geocoder)

Node library for geocoding and reverse geocoding

In development

## Geocoder

* `google` : GoogleGeocoder support adress geocoding and reverse geocoding
* `freegeoip` : FreegeoipGeocoder support ip geocoding


## Http adapter

* `requestify` : This adapter use Requestify library
* `http`       : This adapter use Http nodejs library

## Usage example

    var geocoder = require('node-geocoder')('google', 'requestify');

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


