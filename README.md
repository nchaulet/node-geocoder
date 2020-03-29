# node-geocoder

[![Build Status](https://img.shields.io/travis/nchaulet/node-geocoder.svg?style=flat-square)](https://travis-ci.org/nchaulet/node-geocoder)
![Dependencycy status](https://img.shields.io/david/nchaulet/node-geocoder.svg?style=flat-square)
[![npm version](https://img.shields.io/npm/v/node-geocoder.svg?style=flat-square)](https://www.npmjs.com/package/node-geocoder)

Node library for geocoding and reverse geocoding. Can be used as a nodejs library

## Installation (nodejs library)

    npm install node-geocoder

## Usage example

```javascript
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',

  // Optional depending on the providers
  fetch: customFetchImplementation,
  apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Using callback
const res = await geocoder.geocode('29 champs elysée paris');

// output :
[
  {
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
  }
];
```

## Advanced usage (only google, here, mapquest, locationiq, and opencage providers)

```javascript
const res = await geocoder.geocode({
  address: '29 champs elysée',
  country: 'France',
  zipcode: '75008'
});

// OpenCage advanced usage example
const res = await geocoder.geocode({
  address: '29 champs elysée',
  countryCode: 'fr',
  minConfidence: 0.5,
  limit: 5
});

// Reverse example

const res = await geocoder.reverse({ lat: 45.767, lon: 4.833 });

// Batch geocode

const results = await geocoder.batchGeocode([
  '13 rue sainte catherine',
  'another adress'
]);

// Set specific http request headers:
const nodeFetch = require('node-fetch');

const geocoder = NodeGeocoder({
  provider: 'google',
  fetch: function fetch(url, options) {
    return nodeFetch(url, {
      ...options,
      headers: {
        'user-agent': 'My application <email@domain.com>',
        'X-Specific-Header': 'Specific value'
      }
    });
  }
});
```

## Geocoder Providers (in alphabetical order)

- `agol` : ArcGis Online Geocoding service. Supports geocoding and reverse. Requires a client_id & client_secret
- `datasciencetoolkit` : DataScienceToolkitGeocoder. Supports IPv4 geocoding and address geocoding. Use `options.host` to specify a local instance
- `freegeoip` : FreegeoipGeocoder. Supports IP geocoding
- `geocodio`: Geocodio, Supports address geocoding and reverse geocoding (US only)
- `google` : GoogleGeocoder. Supports address geocoding and reverse geocoding. Use `options.clientId`and `options.apiKey`(privateKey) for business licence. You can also use `options.language` and `options.region` to specify language and region, respectively.
- `here` : HereGeocoder. Supports address geocoding and reverse geocoding. You must specify `options.apiKey` with your Here API key. You can also use `options.language`, `options.politicalView` ([read about political views here](https://developer.here.com/rest-apis/documentation/geocoder/topics/political-views.html)), `options.country`, and `options.state`.
- `locationiq` : LocationIQGeocoder. Supports address geocoding and reverse geocoding just like openstreetmap but does require only a locationiq api key to be set.
  - For `geocode` you can use simple `q` parameter or an object containing th edifferent parameters defined here: http://locationiq.org/#docs
  - For `reverse`, you can pass over `{lat, lon}` and additional parameters defined in http://locationiq.org/#docs
  - No need to specify referer or email addresses, just locationiq api key, note that there are rate limits!
- `mapquest` : MapQuestGeocoder. Supports address geocoding and reverse geocoding. Needs an apiKey
- `nominatimmapquest`: Same geocoder as `openstreetmap`, but queries the MapQuest servers. You need to specify `options.apiKey`
- `opencage`: OpenCage Geocoder. Aggregates many different open geocoder. Supports address and reverse geocoding with [many optional parameters](https://opencagedata.com/api#forward-opt). You need to specify `options.apiKey` which can be obtained at [OpenCage](https://opencagedata.com).
- `opendatafrance`: OpendataFranceGeocoder supports forward and reverse geocoding in France; for more information, see [OpendataFrance API documentation](https://adresse.data.gouv.fr/api/)
- `openmapquest` : Open MapQuestGeocoder (based on OpenStreetMapGeocoder). Supports address geocoding and reverse geocoding. Needs an apiKey
- `openstreetmap` : OpenStreetMapGeocoder. Supports address geocoding and reverse geocoding. You can use `options.language` and `options.email` to specify a language and a contact email address.
  - For `geocode`, you can use an object as value, specifying [one or several parameters](http://nominatim.org/release-docs/latest/api/Search/)
  - For `reverse`, you can use [additional parameters](http://nominatim.org/release-docs/latest/api/Reverse/)
  - You should specify a specific `user-agent` or `referrer` header field as required by the [OpenStreetMap Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
  - Set `options.osmServer` to use custom nominatim server. Example: you can setup local nominatim server by following [these instructions](http://nominatim.org/release-docs/latest/admin/Installation/) and set `options.osmServer: http://localhost:8000` to use local server.
- `nominatimmapquest`: Same geocoder as `openstreetmap`, but queries the MapQuest servers. You need to specify `options.apiKey`
- `pickpoint`: PickPoint Geocoder. Supports address geocoding and reverse geocoding. You need to specify `options.apiKey` obtained at [PickPoint](https://pickpoint.io).
  - As parameter for `geocode` function you can use a string representing an address like "13 rue sainte catherine" or an object with parameters described in [Forward Geocoding Reference](https://pickpoint.io/api-reference#forward-geocoding).
  - For `geocode` function you should use an object where `{lat, lon}` are required parameters. Additional parameters like `zoom` are available, see details in [Reverse Geocoding Reference](https://pickpoint.io/api-reference#reverse-geocoding).
- `smartyStreet`: Smarty street geocoder (US only), you need to specify `options.auth_id` and `options.auth_token`
- `teleport`: Teleport supports city and urban area forward and reverse geocoding; for more information, see [Teleport API documentation](https://developers.teleport.org/api/)
- `tomtom`: TomTomGeocoder. Supports address geocoding. You need to specify `options.apiKey` and can use `options.language` to specify a language
- `virtualearth`: VirtualEarthGeocoder (Bing maps). Supports address geocoding. You need to specify `options.apiKey`
- `yandex`: Yandex support address geocoding, you can use `options.language` to specify language

## Http adapter

Http adapter is deprecated, you can now use the `fetch` to provide your own fetch method compatible with the Fetch API [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Fetch option

With the `options.fetch` you can provide your own method to fetch data. This method should be compatible with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

This allow you to specify a proxy to use, a custom timeout, specific headers, ...

## Formatter

- `gpx` : format result using GPX format
- `string` : format result to an String array (you need to specify `options.formatterPattern` key)
  - `%P` country
  - `%p` country code
  - `%n` street number
  - `%S` street name
  - `%z` zip code
  - `%T` State
  - `%t` state code
  - `%c` City

## More

### Playground

You can try node-geocoder here http://node-geocoder.herokuapp.com/

### Command line tools

[`node-geocoder-cli`](https://github.com/nchaulet/node-geocoder-cli) You can use node-geocoder-cli to geocode in shell

### Extending node geocoder

You can add new geocoders by implementing the two methods `geocode` and `reverse`:

```javascript
const geocoder = {
    geocode: function(value, callback) { ... },
    reverse: function(query, callback) { var lat = query.lat; var lon = query.lon; ... }
}
```

You can also add formatter implementing the following interface

```javascript
const formatter = {
  format: function(data) {
    return formattedData;
  }
};
```

### Contributing

You can improve this project by adding new geocoders.

To run tests just `npm test`.

To check code style just run `npm run lint`.
