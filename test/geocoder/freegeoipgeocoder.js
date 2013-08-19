(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var FreegeoipGeocoder = require('../../lib/geocoder/freegeoipgeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('FreegeoipGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new FreegeoipGeocoder();}).to.throw(Error, 'FreegeoipGeocoder need an httpAdapter');
            });

            it('Should be an instance of FreegeoipGeocoder', function() {

                var freegeoipgeocoder = new FreegeoipGeocoder(mockedHttpAdapter);

                freegeoipgeocoder.should.be.instanceof(FreegeoipGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept adress', function() {

                var freegeoipgeocoder = new FreegeoipGeocoder(mockedHttpAdapter);
                expect(function() {freegeoipgeocoder.geocode('1 rue test');})
                    .to
                    .throw(Error, 'FreegeoipGeocoder suport only ip geocoding');


            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var freegeoipgeocoder = new FreegeoipGeocoder(mockedHttpAdapter);

                freegeoipgeocoder.geocode('127.0.0.1');

                mock.verify();

            });

        });

        describe('#reverse' , function() {
            it('Should throw an error', function() {

                  var freegeoipgeocoder = new FreegeoipGeocoder(mockedHttpAdapter);
                expect(function() {freegeoipgeocoder.reverse(10.0235,-2.3662);})
                    .to
                    .throw(Error, 'FreegeoipGeocoder no support reverse geocoding');

            });
        });


    });

})();