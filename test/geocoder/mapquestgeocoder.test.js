(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var MapQuestGeocoder = require('../../lib/geocoder/mapquestgeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('MapQuestGeocoder', () => {

        describe('#constructor' , () => {

            test('an http adapter must be set', () => {

                expect(function() {new MapQuestGeocoder();}).to.throw(Error, 'MapQuestGeocoder need an httpAdapter');
            });

            test('an apiKey must be set', () => {

                expect(function() {new MapQuestGeocoder(mockedHttpAdapter);}).to.throw(Error, 'MapQuestGeocoder needs an apiKey');
            });

            test('Should be an instance of MapQuestGeocoder', () => {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.should.be.instanceof(MapQuestGeocoder);
            });

        });

        describe('#geocode' , () => {

            test('Should not accept IPv4', () => {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'MapQuestGeocoder does not support geocoding IPv4');

            });

            test('Should not accept IPv6', () => {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'MapQuestGeocoder does not support geocoding IPv6');

            });

            test('Should call httpAdapter get method', () => {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').withArgs(
                    'http://www.mapquestapi.com/geocoding/v1/address',
                    { key: "API_KEY", location: "test" }
                ).once().returns({then: function() {}});

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.geocode('test');

                mock.verify();

            });

        });

        describe('#reverse' , () => {
            test('Should call httpAdapter get method', () => {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.reverse({lat:10.0235,lon:-2.3662});

                mock.verify();

            });

        });


    });

})();
