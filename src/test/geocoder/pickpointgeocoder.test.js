(function () {
  var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

  var PickPointGeocoder = require('../../lib/geocoder/pickpointgeocoder.js');

  var mockedHttpAdapter = {
    get: sinon.stub()
  };

  describe('PickPointGeocoder', () => {
    describe('#constructor', () => {
      test('should be an instance of PickPointGeocoder', () => {
        var geocoder = new PickPointGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });
        geocoder.should.be.instanceof(PickPointGeocoder);
      });

      test('an http adapter must be set', () => {
        expect(function () {
          new PickPointGeocoder();
        }).to.throw(Error, 'PickPointGeocoder need an httpAdapter');
      });

      test('an apiKey must be set', () => {
        expect(function () {
          new PickPointGeocoder(mockedHttpAdapter);
        }).to.throw(Error, 'PickPointGeocoder needs an apiKey');
      });
    });
  });
})();
