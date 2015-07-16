var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

var YandexGeocoder = require('../../lib/geocoder/yandexgeocoder.js');

var mockedHttpAdapter = {
    get: function() {}
};

describe('OpenCageGeocoder', function() {

  describe('#constructor' , function() {
    it('an http adapter must be set', function() {
        expect(function() {new YandexGeocoder();}).to.throw(Error, 'YandexGeocoder need an httpAdapter');
    });
  });

  describe('#geocode' , function() {

    it('Should not accept IPv4', function() {
      var geocoder = new YandexGeocoder(mockedHttpAdapter);
      expect(function() {
        geocoder.geocode('127.0.0.1');
      }).to.throw(Error, 'YandexGeocoder does not support geocoding IPv4');

    });

    it('Should not accept IPv6', function() {
      var geocoder = new YandexGeocoder(mockedHttpAdapter);
      expect(function() {
              geocoder.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
      }).to.throw(Error, 'YandexGeocoder does not support geocoding IPv6');
    });

    it('Should call httpAdapter get method', function() {
      var mock = sinon.mock(mockedHttpAdapter);
      mock.expects('get').once().returns({then: function() {}});

      var geocoder = new YandexGeocoder(mockedHttpAdapter);
      geocoder.geocode('1 champs élysée Paris');

      mock.verify();
    });

    it('Should return geocoded address', function(done) {
        var mock = sinon.mock(mockedHttpAdapter);
        var jsonResult = {"response":{"GeoObjectCollection":{"metaDataProperty":{"GeocoderResponseMetaData":{"request":"189 Bedford Ave Brooklyn","found":"167","results":"1"}},"featureMember":[{"GeoObject":{"metaDataProperty":{"GeocoderMetaData":{"kind":"street","text":"United States, New York, Kings, Brooklyn Ave","precision":"street","AddressDetails":{"Country":{"AddressLine":"New York, Kings, Brooklyn Ave","CountryNameCode":"US","CountryName":"United States","AdministrativeArea":{"AdministrativeAreaName":"New York","Locality":{"LocalityName":"New York","DependentLocality":{"DependentLocalityName":"Kings","Thoroughfare":{"ThoroughfareName":"Brooklyn Ave"}}}}}}}},"description":"Kings, New York, United States","name":"Brooklyn Ave","boundedBy":{"Envelope":{"lowerCorner":"-73.945613 40.626824","upperCorner":"-73.941229 40.680079"}},"Point":{"pos":"-73.944050 40.653388"}}}]}}};
        mock.expects('get').once().callsArgWith(2, false, jsonResult);

        var geocoder = new YandexGeocoder(mockedHttpAdapter);

        geocoder.geocode('Kabasakal Caddesi, Istanbul, Turkey', function(err, results) {
            err.should.to.equal(false);

            results[0].should.to.deep.equal({
                "latitude": '-73.944050',
                "longitude": '40.653388',
                "country": "United States",
                "city": "New York",
                "state" : "New York",
                "streetName": "Brooklyn Ave",
                "countryCode": "US",
                "streetNumber": null
            });

            mock.verify();
            done();
        });
    });

  });

});
