'use strict';

var chai = require('chai'),
should = chai.should(),
expect = chai.expect,
sinon = require('sinon');

var GoogleGeocoder = require('../../lib/geocoder/googlegeocoder.js');
var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

var mockedHttpAdapter = {
  get: function() {
    return {};
  },
  supportsHttps: function() {
    return true;
  }
};

describe('GoogleGeocoder', () => {
  describe('#constructor' , () => {
    test('an http adapter must be set', () => {
      expect(function() {new GoogleGeocoder();}).to.throw(Error, 'GoogleGeocoder need an httpAdapter');
    });

    test('if a clientId is specified an apiKey must be set', () => {
      expect(function() {new GoogleGeocoder(mockedHttpAdapter, {clientId: 'CLIENT_ID'});}).to.throw(Error, 'You must specify a apiKey (privateKey)');
    });

    test(
      'Should be an instance of GoogleGeocoder if an http adapter is provided',
      () => {
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

        googleAdapter.should.be.instanceof(GoogleGeocoder);
      }
    );

    test(
      'Should be an instance of GoogleGeocoder if an http adapter, clientId, and apiKer are provided',
      () => {
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'CLIENT_ID', apiKey: 'API_KEY'});

        googleAdapter.should.be.instanceof(GoogleGeocoder);
      }
    );
  });

  describe('#geocode' , () => {

    test('Should not accept IPv4', () => {

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      expect(function() {
        googleAdapter.geocode('127.0.0.1');
      }).to.throw(Error, 'GoogleGeocoder does not support geocoding IPv4');

    });

    test('Should not accept IPv6', () => {

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      expect(function() {
        googleAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
      }).to.throw(Error, 'GoogleGeocoder does not support geocoding IPv6');

    });

    test('Should accept `language` and `region` as options', () => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
        address: "1 champs élysée Paris",
        language: "ru-RU",
        region: ".de",
        components: "",
        sensor: false
      }).once().returns({then: function() {}});

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { language: 'fr', region: '.ru' });

      googleAdapter.geocode({ address: '1 champs élysée Paris', language: 'ru-RU', region: '.de' });

      mock.verify();
    });

    test('Should call httpAdapter get method', () => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
        address: "1 champs élysée Paris",
        sensor: false
      }).once().returns({then: function() {}});

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.geocode('1 champs élysée Paris');

      mock.verify();
    });

    test(
      'Should call httpAdapter get method with language if specified',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          address: "1 champs élysée Paris",
          sensor: false,
          language: "fr"
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { language: 'fr' });

        googleAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      }
    );

    test(
      'Should call httpAdapter get method with region if specified',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          address: "1 champs élysée Paris",
          sensor: false,
          region: "fr"
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { region: 'fr' });

        googleAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      }
    );

    test(
      'Should call httpAdapter get method with components if called with object',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          address: "1 champs élysée Paris",
          sensor: false,
          components: "country:FR|postal_code:75008"
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

        googleAdapter.geocode({
          address: '1 champs élysée Paris',
          zipcode: '75008',
          country: 'FR'
        });

        mock.verify();
      }
    );

    test(
      'Should call httpAdapter get method with zipcode if country is missing',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          address: "1 champs élysée Paris",
          sensor: false,
          components: "postal_code:75008"
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

        googleAdapter.geocode({
          address: '1 champs élysée Paris',
          zipcode: '75008'
        });

        mock.verify();
      }
    );

    test('Should call httpAdapter get method with key if specified', () => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
        address: "1 champs élysée Paris",
        sensor: false,
        key: "hey-you-guys"
      }).once().returns({then: function() {}});

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { apiKey: 'hey-you-guys' });

      googleAdapter.geocode('1 champs élysée Paris');

      mock.verify();
    });

    test('Should return geocoded address', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
        geometry: {location : {
          lat: 37.386,
          lng: -122.0838
        }},
        address_components: [
        {types: ['country'], long_name: 'France', short_name: 'Fr' },
        {types: ['locality'], long_name: 'Paris' },
        {types: ['postal_code'], long_name: '75008' },
        {types: ['route'], long_name: 'Champs-Élysées' },
        {types: ['street_number'], long_name: '1' },
        {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'},
        {types: ['sublocality_level_1', 'sublocality', 'political'], long_name: 'neighborhood'}
        ],
        country_code: 'US',
        country_name: 'United States',
        locality: 'Mountain View',
      }]}
      );
      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
        err.should.to.equal(false);
        results[0].should.to.deep.equal({
          "latitude"    : 37.386,
          "longitude"   : -122.0838,
          "country"     : "France",
          "city"        : "Paris",
          "zipcode"     : "75008",
          "streetName"  : "Champs-Élysées",
          "streetNumber": "1",
          "countryCode" : "Fr",
          "administrativeLevels": {
            "level1long": "Île-de-France",
            "level1short": "IDF"
          },
          "extra": {
            "confidence": 0,
            "premise": null,
            "subpremise": null,
            "neighborhood": 'neighborhood',
            "establishment": null,
            "googlePlaceId": null
          },
          "formattedAddress": null
        });

        results.raw.should.deep.equal({ status: "OK", results: [{
          geometry: {location : {
            lat: 37.386,
            lng: -122.0838
          }},
          address_components: [
          {types: ['country'], long_name: 'France', short_name: 'Fr' },
          {types: ['locality'], long_name: 'Paris' },
          {types: ['postal_code'], long_name: '75008' },
          {types: ['route'], long_name: 'Champs-Élysées' },
          {types: ['street_number'], long_name: '1' },
          {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'},
          {types: ['sublocality_level_1', 'sublocality', 'political'], long_name: 'neighborhood'}
          ],
          country_code: 'US',
          country_name: 'United States',
          locality: 'Mountain View',
        }]});

        mock.verify();
        done();
      });
    });

    test(
      'Should correctly match most specific neighborhood response value',
      done => {
       var response = { results : [{
         address_components : [
         { long_name : '350', 'short_name' : '350', 'types' : [ 'street_number' ] },
         { long_name : '5th Avenue', short_name : '5th Ave', types : [ 'route' ] },
         { long_name : 'Midtown', short_name : 'Midtown', types : [ 'neighborhood', 'political' ] },
         { long_name : 'Manhattan', short_name : 'Manhattan', types : [ 'sublocality_level_1', 'sublocality', 'political' ] },
         { long_name : 'New York', short_name : 'New York', types : [ 'locality', 'political' ] },
         { long_name : 'New York County', short_name : 'New York County', types : [ 'administrative_area_level_2', 'political' ]},
         { long_name : 'New York', short_name : 'NY', types : [ 'administrative_area_level_1', 'political' ] },
         { long_name : 'United States', short_name : 'US', types : [ 'country', 'political' ] },
         { long_name : '10118', short_name : '10118', types : [ 'postal_code' ] }
         ],
         formatted_address : '350 5th Ave, New York, NY 10118, USA',
         geometry : {
           location : {
             lat : 40.7484799,
             lng : -73.9854246
           },
           location_type : 'ROOFTOP',
           viewport : {
             northeast : { lat : 40.7498288802915, lng : -73.98407561970849 },
             southwest : { lat : 40.7471309197085, lng : -73.98677358029151 }
           }
         },
         place_id : 'ChIJn6wOs6lZwokRLKy1iqRcoKw',
         types : [ 'street_address' ]
       }], status : 'OK' };

       var mock = sinon.mock(mockedHttpAdapter);
       mock.expects('get').once().callsArgWith(2, false, response);
       var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

       googleAdapter.geocode('350 5th Ave, New York, NY 10118', function(err, results) {
         results[0].should.have.deep.property('extra.neighborhood', 'Midtown');
         mock.verify();
         done();
       });
     }
    );

    test('Should handle a not "OK" status', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
        err.message.should.to.equal("Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.");

        results.raw.should.deep.equal({ status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

        mock.verify();
        done();
      });
    });

    test('Should handle a not "OK" status and no error_message', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "INVALID_REQUEST", results: [] });

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
        err.message.should.to.equal("Status is INVALID_REQUEST.");
        mock.verify();
        done();
      });
    });

    test(
      'Should exclude partial match geocoded address if excludePartialMatches option is set to true',
      done => {

        var mock = sinon.mock(mockedHttpAdapter);

        mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
          geometry: {location : {
            lat: 37.386,
            lng: -122.0838
          }},
          address_components: [
          {types: ['country'], long_name: 'France', short_name: 'Fr' },
          {types: ['locality'], long_name: 'Paris' },
          {types: ['postal_code'], long_name: '75008' },
          {types: ['route'], long_name: 'Champs-Élysées' },
          {types: ['street_number'], long_name: '1' },
          {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
          ],
          country_code: 'US',
          country_name: 'United States',
          locality: 'Mountain View',
          partial_match: true
        }]}
        );
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { clientId: 'clientId', apiKey: 'apiKey', excludePartialMatches: true});

        googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
          err.should.to.equal(false);
          results.length.should.eql(0);

          mock.verify();
          done();
        });
      }
    );

    test(
      'Should include partial match geocoded address if excludePartialMatches option is set to false',
      done => {

        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
          geometry: {location : {
            lat: 37.386,
            lng: -122.0838
          }},
          address_components: [
          {types: ['country'], long_name: 'France', short_name: 'Fr' },
          {types: ['locality'], long_name: 'Paris' },
          {types: ['postal_code'], long_name: '75008' },
          {types: ['route'], long_name: 'Champs-Élysées' },
          {types: ['street_number'], long_name: '1' },
          {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
          ],
          country_code: 'US',
          country_name: 'United States',
          locality: 'Mountain View',
          partial_match: true
        }]}
        );
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, { excludePartialMatches: false});

        googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
          err.should.to.equal(false);
          results[0].should.to.deep.equal({
            "latitude"    : 37.386,
            "longitude"   : -122.0838,
            "country"     : "France",
            "city"        : "Paris",
            "zipcode"     : "75008",
            "streetName"  : "Champs-Élysées",
            "streetNumber": "1",
            "countryCode" : "Fr",
            "administrativeLevels": {
              "level1long": "Île-de-France",
              "level1short": "IDF"
            },
            "extra": {
              "confidence": 0,
              "premise": null,
              "subpremise": null,
              "neighborhood": null,
              "establishment": null,
              "googlePlaceId": null
            },
            "formattedAddress": null
          });

          results.raw.should.deep.equal({ status: "OK", results: [{
            geometry: {location : {
              lat: 37.386,
              lng: -122.0838
            }},
            address_components: [
            {types: ['country'], long_name: 'France', short_name: 'Fr' },
            {types: ['locality'], long_name: 'Paris' },
            {types: ['postal_code'], long_name: '75008' },
            {types: ['route'], long_name: 'Champs-Élysées' },
            {types: ['street_number'], long_name: '1' },
            {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
            ],
            country_code: 'US',
            country_name: 'United States',
            locality: 'Mountain View',
            partial_match: true
          }]});

          mock.verify();
          done();
        });
      }
    );

    test(
      'Should include partial match geocoded address if excludePartialMatches option is not set',
      done => {

        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
          geometry: {location : {
            lat: 37.386,
            lng: -122.0838
          }},
          address_components: [
          {types: ['country'], long_name: 'France', short_name: 'Fr' },
          {types: ['locality'], long_name: 'Paris' },
          {types: ['postal_code'], long_name: '75008' },
          {types: ['route'], long_name: 'Champs-Élysées' },
          {types: ['street_number'], long_name: '1' },
          {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
          ],
          country_code: 'US',
          country_name: 'United States',
          locality: 'Mountain View',
          partial_match: true
        }]}
        );
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

        googleAdapter.geocode('1 champs élysées Paris', function(err, results) {
          err.should.to.equal(false);
          results[0].should.to.deep.equal({
            "latitude"    : 37.386,
            "longitude"   : -122.0838,
            "country"     : "France",
            "city"        : "Paris",
            "zipcode"     : "75008",
            "streetName"  : "Champs-Élysées",
            "streetNumber": "1",
            "countryCode" : "Fr",
            "administrativeLevels": {
              "level1long": "Île-de-France",
              "level1short": "IDF"
            },
            "extra": {
              "confidence": 0,
              "premise": null,
              "subpremise": null,
              "neighborhood": null,
              "establishment": null,
              "googlePlaceId": null
            },
            "formattedAddress": null
          });

          results.raw.should.deep.equal({ status: "OK", results: [{
            geometry: {location : {
              lat: 37.386,
              lng: -122.0838
            }},
            address_components: [
            {types: ['country'], long_name: 'France', short_name: 'Fr' },
            {types: ['locality'], long_name: 'Paris' },
            {types: ['postal_code'], long_name: '75008' },
            {types: ['route'], long_name: 'Champs-Élysées' },
            {types: ['street_number'], long_name: '1' },
            {types: ['administrative_area_level_1'], long_name: 'Île-de-France', short_name: 'IDF'}
            ],
            country_code: 'US',
            country_name: 'United States',
            locality: 'Mountain View',
            partial_match: true
          }]});

          mock.verify();
          done();
        });
      }
    );

  });

  describe('#reverse' , () => {
    test('Should call httpAdapter get method', () => {

      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().returns({then: function() {}});

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.reverse({lat:10.0235,lon:-2.3662});

      mock.verify();

    });

    test('Should return geocoded address', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "OK", results: [{
        geometry: {location : {
          lat: 40.714232,
          lng: -73.9612889
        }},
        address_components: [
        {types: ['country'], long_name: 'United States', short_name: 'US' },
        {types: ['locality'], long_name: 'Brooklyn' },
        {types: ['postal_code'], long_name: '11211' },
        {types: ['route'], long_name: 'Bedford Avenue' },
        {types: ['street_number'], long_name: '277' },
        {types: ['administrative_area_level_1'], long_name: 'État de New York', short_name: 'NY'}


        ],
        country_code: 'US',
        country_name: 'United States',
        locality: 'Mountain View',
      }]}
      );
      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);
      googleAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
        err.should.to.equal(false);
        results[0].should.to.deep.equal({
          "latitude"    : 40.714232,
          "longitude"   : -73.9612889,
          "country"     : "United States",
          "city"        : "Brooklyn",
          "zipcode"     : "11211",
          "streetName"  : "Bedford Avenue",
          "streetNumber": "277",
          "countryCode" : "US",
          "administrativeLevels": {
            "level1long": "État de New York",
            "level1short": "NY"
          },
          "extra": {
            "premise": null,
            "subpremise": null,
            "neighborhood": null,
            "establishment": null,
            "googlePlaceId": null,
            "confidence": 0
          },
          "formattedAddress": null
        });

        results.raw.should.deep.equal({ status: "OK", results: [{
          geometry: {location : {
            lat: 40.714232,
            lng: -73.9612889
          }},
          address_components: [
          {types: ['country'], long_name: 'United States', short_name: 'US' },
          {types: ['locality'], long_name: 'Brooklyn' },
          {types: ['postal_code'], long_name: '11211' },
          {types: ['route'], long_name: 'Bedford Avenue' },
          {types: ['street_number'], long_name: '277' },
          {types: ['administrative_area_level_1'], long_name: 'État de New York', short_name: 'NY'}


          ],
          country_code: 'US',
          country_name: 'United States',
          locality: 'Mountain View',
        }]});

        mock.verify();
        done();
      });
    });

    test(
      'Should accept `language`, `result_type` and `location_type` as options',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          latlng: "40.714232,-73.9612889",
          language: "ru-RU",
          sensor: false,
          result_type: 'country',
          location_type: 'ROOFTOP',
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

        googleAdapter.reverse({
          lat: 40.714232,
          lon: -73.9612889,
          language: 'ru-RU',
          result_type: 'country',
          location_type: 'ROOFTOP',
        });

        mock.verify();
      }
    );

    test('Should handle a not "OK" status', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
        err.message.should.to.equal("Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.");
        mock.verify();
        done();
      });
    });

    test('Should handle a not "OK" status and no error_message', done => {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().callsArgWith(2, false, { status: "INVALID_REQUEST", results: [] });

      var googleAdapter = new GoogleGeocoder(mockedHttpAdapter);

      googleAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
        err.message.should.to.equal("Status is INVALID_REQUEST.");
        mock.verify();
        done();
      });
    });

    test(
      'Should call httpAdapter get method with signed url if clientId and apiKey specified',
      () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://maps.googleapis.com/maps/api/geocode/json', {
          address: "1 champs élysée Paris",
          client: "raoul",
          sensor: false,
          signature: "PW1yyLFH9lN16B-Iw7EXiAeMKX8="
        }).once().returns({then: function() {}});

        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'raoul', apiKey: 'foo'});

        googleAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      }
    );

    test(
      'Should generate signatures with all / characters replaced with _',
      () => {
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'james', apiKey: 'foo'});
        var params = {
          sensor: false,
          client: 'james',
          address:  'qqslfzxytfr'
        };
        googleAdapter._signedRequest('https://maps.googleapis.com/maps/api/geocode/json', params);
        expect(params.signature).to.equal('ww_ja1wA8YBE_cfwmx9EQ_5y2pI=');
      }
    );

    test(
      'Should generate signatures with all + characters replaced with -',
      () => {
        var googleAdapter = new GoogleGeocoder(mockedHttpAdapter, {clientId: 'james', apiKey: 'foo'});
        var params = {
          sensor: false,
          client: 'james',
          address: 'lomxcefgkxr'
        };
        googleAdapter._signedRequest('https://maps.googleapis.com/maps/api/geocode/json', params);
        expect(params.signature).to.equal('zLXE-mmcsjp2RobIXjMd9h3P-zM=');
      }
    );
  });
});
