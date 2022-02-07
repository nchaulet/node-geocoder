(function () {
  const chai = require('chai')
  const should = chai.should()
  const expect = chai.expect
  const sinon = require('sinon')

  const MapBoxGeocoder = require('../../lib/geocoder/mapboxgeocoder.js')

  const mockedHttpAdapter = {
    get: function () { }
  }

  describe('MapBoxGeocoder', () => {
    describe('#constructor', () => {
      test('an http adapter must be set', () => {
        expect(function () { new MapBoxGeocoder() }).to.throw(Error, 'MapBoxGeocoder need an httpAdapter')
      })

      test('Should be an instance of MapBoxGeocoder', () => {
        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'apiKey' })

        mapboxAdapter.should.be.instanceof(MapBoxGeocoder)
      })
    })

    describe('#geocode', () => {
      test('Should not accept IPv4', () => {
        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'apiKey' })

        expect(function () {
          mapboxAdapter.geocode('127.0.0.1')
        }).to.throw(Error, 'MapBoxGeocoder does not support geocoding IPv4')
      })

      test('Should not accept IPv6', () => {
        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'apiKey' })

        expect(function () {
          mapboxAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001')
        }).to.throw(Error, 'MapBoxGeocoder does not support geocoding IPv6')
      })

      test('Should call httpAdapter get method', () => {
        const mock = sinon.mock(mockedHttpAdapter)
        mock.expects('get').once().returns({ then: function () { } })

        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'apiKey' })

        mapboxAdapter.geocode('1 champs élysée Paris')

        mock.verify()
      })

      test('Should return geocoded address', done => {
        const mock = sinon.mock(mockedHttpAdapter)
        const resp = {
          type: 'FeatureCollection',
          query: [
            '135',
            'pilkington',
            'avenue',
            'birmingham'
          ],
          features: [
            {
              id: 'address.5430873521632660',
              type: 'Feature',
              place_type: [
                'address'
              ],
              relevance: 0.805556,
              properties: {
                accuracy: 'point'
              },
              text_de: 'Pilkington Avenue',
              place_name_de: '135 Pilkington Avenue, Sutton Coldfield, B72 1LH, Vereinigtes Königreich',
              text: 'Pilkington Avenue',
              place_name: '135 Pilkington Avenue, Sutton Coldfield, B72 1LH, Vereinigtes Königreich',
              center: [
                -1.816079,
                52.54859
              ],
              geometry: {
                type: 'Point',
                coordinates: [
                  -1.816079,
                  52.54859
                ]
              },
              address: '135',
              context: [
                {
                  id: 'postcode.3341297116660100',
                  text_de: 'B72 1LH',
                  text: 'B72 1LH'
                },
                {
                  id: 'place.9163981053829060',
                  wikidata: 'Q868196',
                  text_de: 'Sutton Coldfield',
                  language_de: 'de',
                  text: 'Sutton Coldfield',
                  language: 'de'
                },
                {
                  id: 'district.17727271997855680',
                  wikidata: 'Q23124',
                  text_de: 'West Midlands',
                  language_de: 'de',
                  text: 'West Midlands',
                  language: 'de'
                },
                {
                  id: 'region.13483278848453920',
                  wikidata: 'Q21',
                  short_code: 'GB-ENG',
                  text_de: 'England',
                  language_de: 'de',
                  text: 'England',
                  language: 'de'
                },
                {
                  id: 'country.12405201072814600',
                  wikidata: 'Q145',
                  short_code: 'gb',
                  text_de: 'Vereinigtes Königreich',
                  language_de: 'de',
                  text: 'Vereinigtes Königreich',
                  language: 'de'
                }
              ]
            }
          ]
        }
        mock.expects('get').once().callsArgWith(2, false, resp)

        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'apiKey' })

        mapboxAdapter.geocode('135 pilkington avenue, birmingham', function (err, results) {
          mock.verify()

          err.should.to.equal(false)

          results[0].should.to.deep.equal({
            latitude: 52.54859,
            longitude: -1.816079,
            formattedAddress: '135 Pilkington Avenue, Sutton Coldfield, B72 1LH, Vereinigtes Königreich',
            country: 'Vereinigtes Königreich',
            countryCode: 'GB',
            state: 'England',
            district: 'West Midlands',
            city: 'Sutton Coldfield',
            zipcode: 'B72 1LH',
            neighbourhood: undefined,
            extra: {
              id: 'address.5430873521632660',
              address: 'Pilkington Avenue',
              category: undefined,
              bbox: undefined
            }
          })

          results.raw.should.deep.equal(resp)

          mock.verify()
          done()
        })
      })
    })

    describe('#reverse', () => {
      test('Should return geocoded address', done => {
        const mock = sinon.mock(mockedHttpAdapter)
        const resp = {
          type: 'FeatureCollection',
          query: [
            -73.9612889,
            40.714232
          ],
          features: [
            {
              id: 'address.3679793406555678',
              type: 'Feature',
              place_type: [
                'address'
              ],
              relevance: 1,
              properties: {
                accuracy: 'parcel'
              },
              text_de: 'Bedford Avenue',
              place_name_de: '277 Bedford Avenue, Brooklyn, New York 11211, Vereinigte Staaten',
              text: 'Bedford Avenue',
              place_name: '277 Bedford Avenue, Brooklyn, New York 11211, Vereinigte Staaten',
              center: [
                -73.961297,
                40.714259
              ],
              geometry: {
                type: 'Point',
                coordinates: [
                  -73.961297,
                  40.714259
                ]
              },
              address: '277',
              context: [
                {
                  id: 'neighborhood.2102030',
                  text_de: 'Williamsburg',
                  text: 'Williamsburg'
                },
                {
                  id: 'postcode.10441086852103120',
                  text_de: '11211',
                  text: '11211'
                },
                {
                  id: 'locality.6335122455180360',
                  wikidata: 'Q18419',
                  text_de: 'Brooklyn',
                  language_de: 'de',
                  text: 'Brooklyn',
                  language: 'de'
                },
                {
                  id: 'place.2618194975964500',
                  wikidata: 'Q60',
                  text_de: 'New York City',
                  language_de: 'de',
                  text: 'New York City',
                  language: 'de'
                },
                {
                  id: 'district.3780609411998600',
                  wikidata: 'Q11980692',
                  text_de: 'Kings County',
                  language_de: 'en',
                  text: 'Kings County',
                  language: 'en'
                },
                {
                  id: 'region.17349986251855570',
                  wikidata: 'Q1384',
                  short_code: 'US-NY',
                  text_de: 'New York',
                  language_de: 'de',
                  text: 'New York',
                  language: 'de'
                },
                {
                  id: 'country.19678805456372290',
                  wikidata: 'Q30',
                  short_code: 'us',
                  text_de: 'Vereinigte Staaten',
                  language_de: 'de',
                  text: 'Vereinigte Staaten',
                  language: 'de'
                }
              ]
            }
          ]
        }

        mock.expects('get').once().callsArgWith(2, false, resp)

        const mapboxAdapter = new MapBoxGeocoder(mockedHttpAdapter, { apiKey: 'api' })

        mapboxAdapter.reverse({ lat: 40.714232, lon: -73.9612889 }, function (err, results) {
          err.should.to.equal(false)
          results[0].should.to.deep.equal({
            latitude: 40.714259,
            longitude: -73.961297,
            formattedAddress: '277 Bedford Avenue, Brooklyn, New York 11211, Vereinigte Staaten',
            country: 'Vereinigte Staaten',
            countryCode: 'US',
            state: 'New York',
            district: 'Kings County',
            city: 'New York City',
            zipcode: '11211',
            neighbourhood: 'Williamsburg',
            extra: {
              id: 'address.3679793406555678',
              address: 'Bedford Avenue',
              category: undefined,
              bbox: undefined
            }
          })
          results.raw.should.deep.equal(resp)

          mock.verify()
          done()
        })
      })
    })
  })
})()
