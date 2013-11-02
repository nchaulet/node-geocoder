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

    describe('MapQuestGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new MapQuestGeocoder();}).to.throw(Error, 'MapQuest Geocoder need an httpAdapter');
            });

            it('an apiKey must be set', function() {

                expect(function() {new MapQuestGeocoder(mockedHttpAdapter);}).to.throw(Error, 'MapQuest Geocoder need an apiKey');
            });

            it('Should be an instance of MapQuestGeocoder', function() {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.should.be.instanceof(MapQuestGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept Ipv4', function() {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'MapQuest Geocoder no suport geocoding ip');

            });

            it('Should not accept Ipv6', function() {

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                expect(function() {
                        mapquestAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'MapQuest Geocoder no suport geocoding ip');

            });

        });

        describe('#reverse' , function() {
            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var mapquestAdapter = new MapQuestGeocoder(mockedHttpAdapter, 'API_KEY');

                mapquestAdapter.reverse(10.0235,-2.3662);

                mock.verify();

            });

        });


    });

})();
