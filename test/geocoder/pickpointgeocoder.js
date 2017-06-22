(function () {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var PickPointGeocoder = require('../../lib/geocoder/pickpointgeocoder.js');

    var mockedHttpAdapter = {
        get: sinon.stub(),
        supportsHttps: sinon.stub()
    };

    describe('PickPointGeocoder', function () {

        describe('#constructor', function () {

            it('should be an instance of PickPointGeocoder', function () {
                mockedHttpAdapter.supportsHttps.returns(true);
                var geocoder = new PickPointGeocoder(mockedHttpAdapter, {apiKey: 'API_KEY'});
                geocoder.should.be.instanceof(PickPointGeocoder);
            });

            it('an http adapter must be set', function () {
                expect(function () {
                    new PickPointGeocoder();
                }).to.throw(Error, 'PickPointGeocoder need an httpAdapter');
            });

            it('the adapter should support https', function () {
                mockedHttpAdapter.supportsHttps.returns(false);
                expect(function () {
                    new PickPointGeocoder(mockedHttpAdapter);
                }).to.throw(Error, 'You must use https http adapter');
            });

            it('an apiKey must be set', function () {
                mockedHttpAdapter.supportsHttps.returns(true);
                expect(function () {
                    new PickPointGeocoder(mockedHttpAdapter);
                }).to.throw(Error, 'PickPointGeocoder needs an apiKey');
            });

        });

    });

})();
