(function () {
  var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

  var APlaceGeocoder = require('../../lib/geocoder/aplacegeocoder.js');

  var mockedHttpAdapter = {
    get: function () { },
    supportsHttps: function () { return true; }
  };

  describe('APlaceGeocoder', () => {

    describe('#constructor', () => {

      test('an http adapter must be set', () => {
        expect(function () {
          new APlaceGeocoder();
        }).to.throw(Error, 'APlaceGeocoder need an httpAdapter');
      });

      test('must have an api key as second argument', () => {
        expect(function () {
          new APlaceGeocoder(mockedHttpAdapter);
        }).to.throw(Error, 'You must specify a apiKey (see https://aplace.io/en/documentation/general/authentication)');
      });

      test('Should be an instance of APlaceGeocoder', () => {
        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
        adapter.should.be.instanceOf(APlaceGeocoder);
      });

    });

    describe('#geocode', () => {

      test('Should not accept IPv4', () => {
        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
        expect(function () {
          adapter.geocode('127.0.0.1');
        }).to.throw(Error, 'APlaceGeocoder does not support geocoding IPv4');
      });

      test('Should not accept IPv6', () => {
        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
        expect(function () {
          adapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
        }).to.throw(Error, 'APlaceGeocoder does not support geocoding IPv6');
      });

      test('Should call httpAdapter get method', () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').once().returns({ then: function () { } });
        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
        adapter.geocode('1 Rue de la Paix 75002 Paris');
        mock.verify();
      });

      test('Should return geocoded address', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        var rawResponse = {
          session_id: '1',
          data: [
            {
              'id': '7087754566211821954',
              'score': 10.803571428571429,
              'match': '1 Rue De La Paix',
              'match_details': '75002 Paris, France',
              'lat': 48.868546,
              'lon': 2.33031,
              'type': 'house_number',
              'address': {
                'house_number': '1',
                'road': 'Rue De La Paix',
                'quarter': 'Quartier Gaillon',
                'city': 'Paris',
                'postcode': '75002',
                'county': 'Paris',
                'state': 'Paris',
                'state_code': 'FR-75',
                'region': 'Île-de-France',
                'region_code': 'FR-IDF',
                'country': 'France',
                'country_code': 'FR'
              }
            }
          ]
        };
        mock.expects('get').once().callsArgWith(2, false, rawResponse);

        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });

        adapter.geocode('1 Rue de la paix 75002 Paris', function (err, results) {
          mock.verify();

          err.should.equal(false);

          results.should.have.property('raw');
          results.raw.should.deep.equal(rawResponse);

          results[0].should.deep.equal({
            formattedAddress: '1 Rue De La Paix, 75002 Paris, France',
            latitude: 48.868546,
            longitude: 2.33031,
            extra: {
              quarter: 'Quartier Gaillon',
              county: 'Paris',
              state: 'Paris',
              stateCode: 'FR-75',
              region: 'Île-de-France',
              regionCode: 'FR-IDF',
              country: 'France',
              countryCode: 'FR'
            },
            administrativeLevels: {
              level6long: 'Quartier Gaillon',
              level5long: 'Paris',
              level4long: 'Paris',
              level3long: 'Paris',
              level3short: 'FR-75',
              level2long: 'Île-de-France',
              level2short: 'FR-IDF',
              level1long: 'France',
              level1short: 'FR'
            },
            streetName: 'Rue De La Paix',
            neighbourhood: 'Quartier Gaillon'
          });

        });
        mock.verify();
        done();
      });

      test(
        'Should return geocoded address when queried with an object',
        done => {
          var mock = sinon.mock(mockedHttpAdapter);
          var rawResponse = {
            session_id: '1',
            data: [
              {
                'id': '7087754566211821954',
                'score': 10.803571428571429,
                'match': '1 Rue De La Paix',
                'match_details': '75002 Paris, France',
                'lat': 48.868546,
                'lon': 2.33031,
                'type': 'house_number',
                'address': {
                  'house_number': '1',
                  'road': 'Rue De La Paix',
                  'quarter': 'Quartier Gaillon',
                  'city': 'Paris',
                  'postcode': '75002',
                  'county': 'Paris',
                  'state': 'Paris',
                  'state_code': 'FR-75',
                  'region': 'Île-de-France',
                  'region_code': 'FR-IDF',
                  'country': 'France',
                  'country_code': 'FR'
                }
              }
            ]
          };
          mock.expects('get').once().callsArgWith(2, false, rawResponse);

          var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
          var query = {
            'address': '1 rue de la paix 75002 Paris',
          };
          adapter.geocode(query, function (err, results) {
            mock.verify();
            err.should.equal(false);

            results.should.have.length.of(1);
            results[0].should.deep.equal({
              formattedAddress: '1 Rue De La Paix, 75002 Paris, France',
              latitude: 48.868546,
              longitude: 2.33031,
              extra: {
                quarter: 'Quartier Gaillon',
                county: 'Paris',
                state: 'Paris',
                stateCode: 'FR-75',
                region: 'Île-de-France',
                regionCode: 'FR-IDF',
                country: 'France',
                countryCode: 'FR'
              },
              administrativeLevels: {
                level6long: 'Quartier Gaillon',
                level5long: 'Paris',
                level4long: 'Paris',
                level3long: 'Paris',
                level3short: 'FR-75',
                level2long: 'Île-de-France',
                level2short: 'FR-IDF',
                level1long: 'France',
                level1short: 'FR'
              },
              streetName: 'Rue De La Paix',
              neighbourhood: 'Quartier Gaillon'
            });

            results.should.have.property('raw');
            results.raw.should.deep.equal(rawResponse);
          });
          mock.verify();
          done();
        }
      );

    });

    describe('#reverse', () => {

      test('Should correctly return a result for a reverse search', done => {
        var mock = sinon.mock(mockedHttpAdapter);

        var rawResponse = {
          'session_id': '1',
          'data': [
            {
              'match': 'Quartier du Palais Royal',
              'match_details': '75002 Paris 1er Arrondissement, France',
              'lat': 48.866667,
              'lon': 2.333333,
              'type': 'quarter',
              'address': {
                'house_number': '',
                'road': '',
                'quarter': 'Quartier du Palais Royal',
                'city': 'Paris 1er Arrondissement',
                'postcode': '75002',
                'county': 'Paris',
                'state': 'Paris',
                'state_code': 'FR-75',
                'region': 'Île-de-France',
                'region_code': 'FR-IDF',
                'country': 'France',
                'country_code': 'FR'
              }
            }
          ]
        };
        mock.expects('get').once().callsArgWith(2, false, rawResponse);

        var adapter = new APlaceGeocoder(mockedHttpAdapter, { apiKey: 'API_KEY' });
        adapter.reverse({ lat: 48.866667, lon: 2.333333 }, function (err, results) {
          err.should.equal(false);
          // check for empty result
          results.should
            .be.an('array')
            .have.length.of(1);
          results.should.have.property('raw');

          mock.verify();
          done();
        });
      });

    });

  });
})();
