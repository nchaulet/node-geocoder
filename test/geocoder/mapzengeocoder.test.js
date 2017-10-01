(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var MapzenGeocoder = require('../../lib/geocoder/mapzengeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('MapzenGeocoder', () => {

        describe('#constructor' , () => {

            test('an http adapter must be set', () => {

                expect(function() {new MapzenGeocoder();}).to.throw(Error, 'MapzenGeocoder need an httpAdapter');
            });

            test('an apiKey must be set', () => {

                expect(function() {new MapzenGeocoder(mockedHttpAdapter);}).to.throw(Error, 'MapzenGeocoder needs an apiKey');
            });

            test('Should be an instance of MapzenGeocoder', () => {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                mapzenAdapter.should.be.instanceof(MapzenGeocoder);
            });

        });

        describe('#geocode' , () => {

            test('Should not accept IPv4', () => {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapzenAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'MapzenGeocoder does not support geocoding IPv4');

            });

            test('Should not accept IPv6', () => {

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapzenAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'MapzenGeocoder does not support geocoding IPv6');

            });

        });

        describe('#reverse' , () => {
            test('Should call httpAdapter get method', () => {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var mapzenAdapter = new MapzenGeocoder(mockedHttpAdapter, 'API_KEY');

                mapzenAdapter.reverse({lat:10.0235,lon:-2.3662});

                mock.verify();
            });

        });


    });

})();
