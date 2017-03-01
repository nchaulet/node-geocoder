/**
 * Created by caliskan on 22.02.17.
 */

(function() {
  var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

  var HereGeocoderWithSuggestions = require('../../lib/geocoder/heregeocoderwithsuggestions.js');
  var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

  var mockedHttpAdapter = {
    get: function() {
      return {};
    },
    supportsHttps: function() {
      return true;
    }
  };

  describe('HereGeocoderWithSuggestions', function() {

    describe('#constructor' , function() {
      it('an http adapter must be set', function() {
        expect(function() {new HereGeocoderWithSuggestions();}).to.throw(Error, 'HereGeocoderWithSuggestions need an httpAdapter');
      });

      it('requires appId and appCode to be specified', function() {
        expect(function() {new HereGeocoderWithSuggestions(mockedHttpAdapter, {});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
        expect(function() {new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID'});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
        expect(function() {new HereGeocoderWithSuggestions(mockedHttpAdapter, {appCode: 'APP_CODE'});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
      });

      it('Should be an instance of HereGeocoderWithSuggestions if an http adapter, appId, and appCode are provided', function() {
        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

        hereAdapter.should.be.instanceof(HereGeocoderWithSuggestions);
      });
    });

    describe('#geocode' , function() {
      it('Should not accept IPv4', function () {

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

        expect(function () {
          hereAdapter.geocode('127.0.0.1');
        }).to.throw(Error, 'HereGeocoderWithSuggestions does not support geocoding IPv4');

      });

      it('Should not accept IPv6', function () {

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

        expect(function () {
          hereAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
        }).to.throw(Error, 'HereGeocoderWithSuggestions does not support geocoding IPv6');

      });

      it('Should call httpAdapter get method', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "1 champs élysée Paris",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

        hereAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      it('Should call httpAdapter get method with language if specified', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "1 champs élysée Paris",
          language: "en",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', language: 'en'});

        hereAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      it('Should call httpAdapter get method with politicalView if specified', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "1 champs élysée Paris",
          politicalview: "GRE",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {
          appId: 'APP_ID',
          appCode: 'APP_CODE',
          politicalView: 'GRE'
        });

        hereAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      it('Should call httpAdapter get method with country if specified', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "1 champs élysée Paris",
          country: "FR",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', country: 'FR'});

        hereAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      it('Should call httpAdapter get method with state if specified', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "1 champs élysée Paris",
          state: "Île-de-France",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {
          appId: 'APP_ID',
          appCode: 'APP_CODE',
          state: 'Île-de-France'
        });

        hereAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      it('Should call httpAdapter get method with changed country if called with object containing country', function () {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').withArgs('https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json', {
          query: "Kaiserswerther Str 10, Berlin",
          country: "DE",
          app_code: "APP_CODE",
          app_id: "APP_ID",
          additionaldata: "Country2,true",
          gen: 8
        }).once().returns({
          then: function () {
          }
        });

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {
          appId: 'APP_ID',
          appCode: 'APP_CODE',
          country: 'FR'
        });

        hereAdapter.geocode({
          query: 'Kaiserswerther Str 10, Berlin',
          country: 'DE'
        });

        mock.verify();
      });

      it('Should return geocoded address', function (done) {
        var mock = sinon.mock(mockedHttpAdapter);
        mock.expects('get').thrice().callsArgWith(2, false, { suggestions:
          [ { label: 'Deutschland, Bremen',
              language: 'de',
              countryCode: 'DEU',
              locationId: 'NT_SOWuYQhksDF8rxc6HnhIMA',
              address: [Object],
              matchLevel: 'state' },
            { label: 'Deutschland, Bremen, Bremen, Bremen',
              language: 'de',
              countryCode: 'DEU',
              locationId: 'NT_p0jRnQzY27JW0p7z9sutaA',
              address: [Object],
              matchLevel: 'city' }
          ] }
        ).onCall(1).callsArgWith(2, false, { Response:
          { MetaInfo: { Timestamp: '2015-08-21T07:53:51.042+0000' },
            View:
              [ { _type: 'SearchResultsViewType',
                ViewId: 0,
                Result:
                  [ { Relevance: 1,
                    MatchLevel: 'houseNumber',
                    MatchQuality:
                      { City: 1,
                        Street: [ 1 ],
                        HouseNumber: 1 },
                    MatchType: 'pointAddress',
                    Location:
                      { LocationId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD',
                        LocationType: 'address',
                        DisplayPosition: { Latitude: 52.44841, Longitude: 13.28755 },
                        NavigationPosition: [ { Latitude: 52.44854, Longitude: 13.2874 } ],
                        MapView:
                          { TopLeft:
                            { Latitude: 52.4495342,
                              Longitude: 13.2857055 },
                            BottomRight:
                              { Latitude: 52.4472858,
                                Longitude: 13.2893945 } },
                        Address:
                          { Label: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                            Country: 'DEU',
                            State: 'Berlin',
                            County: 'Berlin',
                            City: 'Berlin',
                            District: 'Dahlem',
                            Street: 'Kaiserswerther Straße',
                            HouseNumber: '10',
                            PostalCode: '14195',
                            AdditionalData:
                              [ { value: 'DE', key: 'Country2' },
                                { value: 'Deutschland', key: 'CountryName' },
                                { value: 'Berlin', key: 'StateName' },
                                { value: 'Berlin', key: 'CountyName' } ] } } } ] } ] } }
        ).onCall(2).callsArgWith(2, false, { Response:
          { MetaInfo: { Timestamp: '2015-08-21T07:53:51.042+0000' },
            View:
              [ { _type: 'SearchResultsViewType',
                ViewId: 0,
                Result:
                  [ { Relevance: 1,
                    MatchLevel: 'houseNumber',
                    MatchQuality:
                      { City: 1,
                        Street: [ 1 ],
                        HouseNumber: 1 },
                    MatchType: 'pointAddress',
                    Location:
                      { LocationId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD',
                        LocationType: 'address',
                        DisplayPosition: { Latitude: 52.44841, Longitude: 13.28755 },
                        NavigationPosition: [ { Latitude: 52.44854, Longitude: 13.2874 } ],
                        MapView:
                          { TopLeft:
                            { Latitude: 52.4495342,
                              Longitude: 13.2857055 },
                            BottomRight:
                              { Latitude: 52.4472858,
                                Longitude: 13.2893945 } },
                        Address:
                          { Label: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                            Country: 'DEU',
                            State: 'Berlin',
                            County: 'Berlin',
                            City: 'Berlin',
                            District: 'Dahlem',
                            Street: 'Kaiserswerther Straße',
                            HouseNumber: '10',
                            PostalCode: '14195',
                            AdditionalData:
                              [ { value: 'DE', key: 'Country2' },
                                { value: 'Deutschland', key: 'CountryName' },
                                { value: 'Berlin', key: 'StateName' },
                                { value: 'Berlin', key: 'CountyName' } ] } } } ] } ] } }
        );

        var hereAdapter = new HereGeocoderWithSuggestions(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

        hereAdapter.geocode('Kaiserswerther Str 10, Berlin', function (err, results) {
          err.should.to.equal(false);

          for (var index = 0; index < results.raw.length; ++index) {
            results[ index ].should.to.deep.equal({
              formattedAddress: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
              latitude: 52.44841,
              longitude: 13.28755,
              country: 'Deutschland',
              countryCode: 'DE',
              state: 'Berlin',
              county: 'Berlin',
              city: 'Berlin',
              zipcode: '14195',
              district: 'Dahlem',
              streetName: 'Kaiserswerther Straße',
              streetNumber: '10',
              building: null,
              extra: { herePlaceId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD', confidence: 1 },
              administrativeLevels: { level1long: 'Berlin', level2long: 'Berlin' }
            });

            results.raw[ index ].should.deep.equal({
                Response: {
                  MetaInfo: {Timestamp: '2015-08-21T07:53:51.042+0000'},
                  View: [{
                    _type: 'SearchResultsViewType',
                    ViewId: 0,
                    Result: [{
                      Relevance: 1,
                      MatchLevel: 'houseNumber',
                      MatchQuality: {
                        City: 1,
                        Street: [1],
                        HouseNumber: 1
                      },
                      MatchType: 'pointAddress',
                      Location: {
                        LocationId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD',
                        LocationType: 'address',
                        DisplayPosition: {Latitude: 52.44841, Longitude: 13.28755},
                        NavigationPosition: [{Latitude: 52.44854, Longitude: 13.2874}],
                        MapView: {
                          TopLeft: {
                            Latitude: 52.4495342,
                            Longitude: 13.2857055
                          },
                          BottomRight: {
                            Latitude: 52.4472858,
                            Longitude: 13.2893945
                          }
                        },
                        Address: {
                          Label: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                          Country: 'DEU',
                          State: 'Berlin',
                          County: 'Berlin',
                          City: 'Berlin',
                          District: 'Dahlem',
                          Street: 'Kaiserswerther Straße',
                          HouseNumber: '10',
                          PostalCode: '14195',
                          AdditionalData: [{value: 'DE', key: 'Country2'},
                            {value: 'Deutschland', key: 'CountryName'},
                            {value: 'Berlin', key: 'StateName'},
                            {value: 'Berlin', key: 'CountyName'}]
                        }
                      }
                    }]
                  }]
                }
              }
            );
          }

          mock.verify();
          done();
        });
      });
    });
  });
})();
