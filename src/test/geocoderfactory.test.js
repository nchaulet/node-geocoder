const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const GoogleGeocoder = require('../lib/geocoder/googlegeocoder.js');
const HereGeocoder = require('../lib/geocoder/heregeocoder.js');
const GeocoderFactory = require('../lib/geocoderfactory.js');
const DataScienceToolkitGeocoder = require('../lib/geocoder/datasciencetoolkitgeocoder.js');
const OpenStreetMapGeocoder = require('../lib/geocoder/openstreetmapgeocoder.js');
const LocationIQGeocoder = require('../lib/geocoder/locationiqgeocoder.js');
const PickPointGeocoder = require('../lib/geocoder/pickpointgeocoder.js');

const FetchAdapter = require('../lib/httpadapter/fetchadapter.js');

const GpxFormatter = require('../lib/formatter/gpxformatter.js');
const StringFormatter = require('../lib/formatter/stringformatter.js');

describe('GeocoderFactory', () => {
  describe('getGeocoder', () => {
    test('called with "google", and extra business key must return google geocoder with business key', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        clientId: 'CLIENT_ID',
        apiKey: 'API_KEY'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.options.clientId.should.be.equal('CLIENT_ID');
      geocoderAdapter.options.apiKey.should.be.equal('API_KEY');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "google", and extra business key must return google geocoder with business key', () => {
      const geocoder = GeocoderFactory.getGeocoder({
        provider: 'google',
        clientId: 'CLIENT_ID',
        apiKey: 'API_KEY'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.options.clientId.should.be.equal('CLIENT_ID');
      geocoderAdapter.options.apiKey.should.be.equal('API_KEY');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "google", "fetch" and extra business key and excludePartialMatches must return google geocoder with fetch adapter and business key and exclude partial matches', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        clientId: 'CLIENT_ID',
        apiKey: 'API_KEY',
        excludePartialMatches: true
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.options.clientId.should.be.equal('CLIENT_ID');
      geocoderAdapter.options.apiKey.should.be.equal('API_KEY');
      geocoderAdapter.options.excludePartialMatches.should.be.equal(true);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "google" and extra business key and excludePartialMatches must return google geocoder with business key and exclude partial matches', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        clientId: 'CLIENT_ID',
        apiKey: 'API_KEY',
        excludePartialMatches: true
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.options.clientId.should.be.equal('CLIENT_ID');
      geocoderAdapter.options.apiKey.should.be.equal('API_KEY');
      geocoderAdapter.options.excludePartialMatches.should.be.equal(true);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "google", "http", extra language key and extra region must return google geocoder with options language', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        language: 'fr',
        region: 'de'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.options.language.should.be.equal('fr');
      geocoderAdapter.options.region.should.be.equal('de');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "google" and "http" and "gpx" must return google geocoder with gpx formatter', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        formatter: 'gpx'
      });

      const geocoderAdapter = geocoder._geocoder;
      const formatter = geocoder._formatter;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      formatter.should.be.instanceof(GpxFormatter);
    });

    test('called with "google" and "http" and "string" must return google geocoder with string formatter', () => {
      const geocoder = GeocoderFactory.getGeocoder('google', {
        formatter: 'string',
        formatterPattern: 'PATTERN'
      });

      const geocoderAdapter = geocoder._geocoder;
      const formatter = geocoder._formatter;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      formatter.should.be.instanceof(StringFormatter);
    });

    test('called with "google" must return google geocoder with fetch adapter', () => {
      const geocoder = GeocoderFactory.getGeocoder('google');

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "here", "http" and extra business key must return here geocoder with business key', () => {
      const geocoder = GeocoderFactory.getGeocoder({
        provider: 'here',
        appId: 'APP_ID',
        appCode: 'APP_CODE'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.options.appId.should.be.equal('APP_ID');
      geocoderAdapter.options.appCode.should.be.equal('APP_CODE');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "here", "https" and extra business key must return here geocoder with business key', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.options.appId.should.be.equal('APP_ID');
      geocoderAdapter.options.appCode.should.be.equal('APP_CODE');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "here" and "http" and language must return here geocoder with language', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        language: 'en'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      geocoderAdapter.options.language.should.be.equal('en');
    });

    test('called with "here" and "http" and politicalView must return here geocoder with politicalView', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        politicalView: 'GRE'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      geocoderAdapter.options.politicalView.should.be.equal('GRE');
    });

    test('called with "here" and "http" and country must return here geocoder with  country', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        country: 'FR'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      geocoderAdapter.options.country.should.be.equal('FR');
    });

    test('called with "here" and "http" and state must return here geocoder with state', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        state: 'Île-de-France'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      geocoderAdapter.options.state.should.be.equal('Île-de-France');
    });

    test('called with "here" and "http" and "gpx" must return here geocoder with gpx formatter', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        formatter: 'gpx'
      });

      const geocoderAdapter = geocoder._geocoder;
      const formatter = geocoder._formatter;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      formatter.should.be.instanceof(GpxFormatter);
    });

    test('called with "here" and "http" and "string" must return here geocoder with string formatter', () => {
      const geocoder = GeocoderFactory.getGeocoder('here', {
        appId: 'APP_ID',
        appCode: 'APP_CODE',
        formatter: 'string',
        formatterPattern: 'PATTERN'
      });

      const geocoderAdapter = geocoder._geocoder;
      const formatter = geocoder._formatter;

      geocoderAdapter.should.be.instanceof(HereGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      formatter.should.be.instanceof(StringFormatter);
    });

    test('called with "datasciencetoolkit" and "http" must return datasciencetoolkit geocoder', () => {
      const geocoder = GeocoderFactory.getGeocoder('datasciencetoolkit');

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(DataScienceToolkitGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "datasciencetoolkit" "http" and "host" option must return datasciencetoolkit geocoder with host extra', () => {
      const geocoder = GeocoderFactory.getGeocoder('datasciencetoolkit', {
        host: 'raoul.io'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(DataScienceToolkitGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
      geocoderAdapter.options.host.should.be.equal('raoul.io');
    });

    test('called with "openstreetmap" and "http" must return openstreetmap geocoder with adapter', () => {
      const geocoder = GeocoderFactory.getGeocoder('openstreetmap');

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(OpenStreetMapGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "locationiq" and "http" must return locationiq geocoder with adapter', () => {
      const geocoder = GeocoderFactory.getGeocoder('locationiq', {
        apiKey: 'API_KEY'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(LocationIQGeocoder, 'api-key');
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "zaertyazeaze" must throw an error', () => {
      expect(function () {
        GeocoderFactory.getGeocoder('zaertyazeaze');
      }).to.throw(Error, 'No geocoder provider find for : zaertyazeaze');
    });

    test('called with "google", "https" and extra timeout must return google geocoder with http adapter and timeout', () => {
      const timeout = 5 * 1000;
      const geocoder = GeocoderFactory.getGeocoder('google', {
        clientId: 'CLIENT_ID',
        apiKey: 'API_KEY',
        timeout: timeout
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(GoogleGeocoder);
      geocoderAdapter.httpAdapter.options.timeout.should.be.equal(timeout);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });

    test('called with "pickpoint" and API key must return pickpoint geocoder with fetch adapter', () => {
      const geocoder = GeocoderFactory.getGeocoder('pickpoint', {
        apiKey: 'API_KEY'
      });

      const geocoderAdapter = geocoder._geocoder;

      geocoderAdapter.should.be.instanceof(PickPointGeocoder);
      geocoderAdapter.httpAdapter.should.be.instanceof(FetchAdapter);
    });
  });
});
