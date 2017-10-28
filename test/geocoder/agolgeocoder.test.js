var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var sinon = require('sinon');

var AGOLGeocoder = require('../../lib/geocoder/agolgeocoder.js');

var mockedHttpAdapter = {
  get: function() {
    return {};
  }
};

var mockedRequestifyAdapter = {
  requestify: function() {
    return {};
  },
  get: function() {
    return {};
  }
};

var mockedAuthHttpAdapter = {
  requestify: function() {
    return {};
  },
  get: function() {
    return {
      'err': false,
      'result': {
        'access_token':"ABCD",
        'expires_in': 10000
      }
    };
  }
};

var mockedOptions = {
  'client_id': "CLIENT_ID",
  'client_secret': "CLIENT_SECRET"
};

describe('AGOLGeocoder', () => {

  describe('#constructor' , () => {
    test('an http adapter must be set', () => {
      expect(function() {new AGOLGeocoder();}).to.throw(Error, 'ArcGis Online Geocoder requires a httpAdapter to be defined');
    });

    test('client_id should be set', () => {
      expect(function() {new AGOLGeocoder(mockedRequestifyAdapter, {client_secret: 'CLIENT_SECRET'});}).to.throw(Error, 'You must specify the client_id and the client_secret');
    });

    test('client_secret should be set', () => {
      expect(function() {new AGOLGeocoder(mockedRequestifyAdapter, {client_id: 'CLIENT_ID'});}).to.throw(Error, 'You must specify the client_id and the client_secret');
    });

    test(
      'expect an error if HTTPAdapter is provided while options are not',
      () => {
        expect(
          function() {
            new AGOLGeocoder(mockedRequestifyAdapter);
          }).to.throw(
          Error,'You must specify the client_id and the client_secret');
        }
    );

    test(
      'Should be an instance of AGOLGeocoder if an http adapter and proper options are supplied',
      () => {
        var geocoder = new AGOLGeocoder(mockedRequestifyAdapter, mockedOptions);

        geocoder.should.be.instanceof(AGOLGeocoder);
      }
    );
  });

  describe('#geocode' , () => {
    test('Should not accept IPv4', () => {

      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);

      expect(function() {
        geocoder.geocode('127.0.0.1');
      }).to.throw(Error, 'The AGOL geocoder does not support IP addresses');

    });

    test('Should not accept IPv6', () => {

      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);

      expect(function() {
        geocoder.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
      }).to.throw(Error, 'The AGOL geocoder does not support IP addresses');

    });

    test('Should call out for authentication', () => {
      var mock = sinon.mock(mockedAuthHttpAdapter);
      mock.expects('get').withArgs("https://www.arcgis.com/sharing/oauth2/token", {
        'client_id': mockedOptions.client_id,
        'grant_type': 'client_credentials',
        'client_secret': mockedOptions.client_secret
      }).once().returns({then: function (err,result) {}});

      var geocoder = new AGOLGeocoder(mockedAuthHttpAdapter,mockedOptions);

      geocoder.geocode('1 champs élysée Paris');

      mock.verify();
    });

    test('Should return cached token', () => {
      var geocoder = new AGOLGeocoder(mockedAuthHttpAdapter,mockedOptions);

      geocoder._getToken(function(err,token) {
        token.should.equal("ABCD");
      });
      geocoder._getToken(function(err,token) {
        token.should.equal("ABCD");
      });
    });

    test('Should assume cached token is invalid', () => {
      var geocoder = new AGOLGeocoder(mockedAuthHttpAdapter,mockedOptions);

      geocoder.cache.token = "AAA";
      geocoder.cache.tokenExp = ((new Date()).getTime() - 2000);

            //Verify token is old
            geocoder.cache.token.should.equal("AAA");

            //Verify that expired token is replaced
            geocoder._getToken(function(err,token) {
              token.should.equal("ABCD");
            });

          });

    test('Should return geocoded address', done => {
      var mock = sinon.mock(mockedRequestifyAdapter);

      mock.expects('get').once().callsArgWith(2, false,
        '{"spatialReference":{"wkid":4326,"latestWkid":4326},"locations":[{"name":"380 New York St, Redlands, California, 92373","extent":{"xmin":-117.196701,"ymin":34.055489999999999,"xmax":-117.19470099999999,"ymax":34.057490000000001},"feature":{"geometry":{"x":-117.19566584280369,"y":34.056490727765947},"attributes":{"AddNum":"380","StPreDir":"","StName":"New York","StType":"St","City":"Redlands","Postal":"92373","Region":"California","Country":"USA"}}}]}'
        );
      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);

            //Force valid tokens (this was tested separately)
            geocoder._getToken = function(callback) {
              callback(false,"ABCD");
            };
            geocoder.geocode('380 New York St, Redlands, CA 92373', function(err, results) {
              err.should.to.equal(false);
              results[0].should.to.deep.equal({
                latitude: 34.05649072776595,
                longitude: -117.19566584280369,
                country: 'USA',
                city: 'Redlands',
                state: 'California',
                stateCode: null,
                zipcode: '92373',
                streetName: ' New York St',
                streetNumber: '380',
                countryCode: 'USA'
              });
              mock.verify();
              done();
            });
          });

    test('Should handle a not "OK" status', done => {
      var mock = sinon.mock(mockedRequestifyAdapter);

      mock.expects('get').once().callsArgWith(2, false,
        '{"error":{"code":498,"message":"Invalid Token","details":[]}}'
        );
      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);

            //Force valid tokens (this was tested separately)
            geocoder._getToken = function(callback) {
              callback(false,"ABCD");
            };
            geocoder.geocode('380 New York St, Redlands, CA 92373', function(err, results) {
                //err.should.to.equal(false);
                err.should.to.deep.equal({"code":498,"message":"Invalid Token","details":[]});
                mock.verify();
                done();
              });
          });
  });

  describe('#reverse' , () => {
    test('Should call httpAdapter get method', () => {

      var mock = sinon.mock(mockedRequestifyAdapter);
      mock.expects('get').once().returns({then: function() {}});

      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);

      geocoder.reverse(10.0235,-2.3662);

      mock.verify();

    });

    test('Should return geocoded address', done => {
      var mock = sinon.mock(mockedRequestifyAdapter);
      mock.expects('get').once().callsArgWith(2, false,
        '{"address":{"Address":"1190 E Kenyon Ave","Neighborhood":null,"City":"Englewood","Subregion":null,"Region":"Colorado","Postal":"80113","PostalExt":null,"CountryCode":"USA","Loc_name":"USA.PointAddress"},"location":{"x":-104.97389993455704,"y":39.649423090952013,"spatialReference":{"wkid":4326,"latestWkid":4326}}}'
        );
      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);
              //Force valid tokens (this was tested separately)
              geocoder._getToken = function(callback) {
                callback(false,"ABCD");
              };
              geocoder.reverse({lat:-104.98469734299971,lon:39.739146640000456}, function(err, results) {
                err.should.to.equal(false);
                results[0].should.to.deep.equal({
                  latitude: 39.64942309095201,
                  longitude: -104.97389993455704,
                  country: 'USA',
                  city: 'Englewood',
                  state: 'Colorado',
                  zipcode: '80113',
                  countryCode: 'USA',
                  address: '1190 E Kenyon Ave',
                  neighborhood: null,
                  loc_name: 'USA.PointAddress' });
                mock.verify();
                done();
              });
            });

    test('Should handle a not "OK" status', done => {
      var mock = sinon.mock(mockedRequestifyAdapter);
      mock.expects('get').once().callsArgWith(2, false,
        '{"error":{"code":42,"message":"Random Error","details":[]}}'
        );

      var geocoder = new AGOLGeocoder(mockedRequestifyAdapter,mockedOptions);
              //Force valid tokens (this was tested separately)
              geocoder._getToken = function(callback) {
                callback(false,"ABCD");
              };
              geocoder.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
                err.should.to.deep.equal({"code":42,"message":"Random Error","details":[]});
                mock.verify();
                done();
              });
            });
  });
});
