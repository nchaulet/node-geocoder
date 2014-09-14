(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var SmartyStreets = require('../../lib/geocoder/smartystreetsgeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('SmartyStreets', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new SmartyStreets();}).to.throw(Error, 'SmartyStreets need an httpAdapter');
            });

            it('an auth-id and auth-token must be set', function() {

                expect(function() {new SmartyStreets(mockedHttpAdapter);}).to.throw(Error, 'You must specify an auth-id and auth-token!');
            });

            it('Should be an instance of SmartyStreets', function() {

                var smartyStreetsAdapter = new SmartyStreets(mockedHttpAdapter, 'AUTH_ID', 'AUTH_TOKEN');

                smartyStreetsAdapter.should.be.instanceof(SmartyStreets);
            });

        });

        describe('#geocode' , function() {

            it('Should call httpAdapter get method', function(){
              var mock = sinon.mock(mockedHttpAdapter);
              mock.expects('get').withArgs('https://api.smartystreets.com/street-address', {
                "street": "1 Infinite Loop, Cupertino, CA",
                "auth-id": "AUTH_ID",
                "auth-token": "AUTH_TOKEN",
                "format": "json"
              }).once().returns({then: function() {}});

              var smartyStreetsAdapter = new SmartyStreets(mockedHttpAdapter, "AUTH_ID", "AUTH_TOKEN");

              smartyStreetsAdapter.geocode("1 Infinite Loop, Cupertino, CA");
              mock.verify();
            });
        });

        describe('#reverse' , function() {
            it('Should throw expection', function() {
              var smartyStreetsAdapter = new SmartyStreets(mockedHttpAdapter, 'AUTH_ID', 'AUTH_TOKEN');

                expect(function() {
                        smartyStreetsAdapter.reverse(10.0235,-2.3662);
                }).to.throw(Error, 'SmartyStreets doesnt support reverse geocoding!');
            });
        });
    });
})();
