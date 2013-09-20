(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var Geocoder = require('../lib/geocoder.js');

    var mockedGeocoder = {
        geocode: function() {},
        reverse: function() {}
    };

    describe('Geocoder', function() {

        describe('#constructor' , function() {

            it('Should set _geocoder', function() {

                var geocoder = new Geocoder(mockedGeocoder);

                geocoder._geocoder.should.be.equal(mockedGeocoder);
            });
        });

        describe('#geocode' , function() {
            it('Should call mockedGeocoder geocoder method', function() {
                var mock = sinon.mock(mockedGeocoder);
                mock.expects('geocode').once().returns({then: function() {}});

                var geocoder = new Geocoder(mockedGeocoder);

                geocoder.geocode('127.0.0.1');

                mock.verify();
            });
        });

        describe('#reverse' , function() {
            it('Should call mockedGeocoder reverse method', function() {
                var mock = sinon.mock(mockedGeocoder);
                mock.expects('reverse').once().returns({then: function() {}});

                var geocoder = new Geocoder(mockedGeocoder);

                geocoder.reverse(1, 2);

                mock.verify();
            });
        });


    });

})();