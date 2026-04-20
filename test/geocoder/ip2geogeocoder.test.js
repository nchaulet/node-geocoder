(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var Ip2geoGeocoder = require('../../lib/geocoder/ip2geogeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('Ip2geoGeocoder', () => {

        describe('#constructor', () => {
            test('an http adapter must be set', () => {
                expect(function() {new Ip2geoGeocoder();}).to.throw(Error, 'Ip2geoGeocoder need an httpAdapter');
            });

            test('an apiKey must be set', () => {
                expect(function() {new Ip2geoGeocoder(mockedHttpAdapter);}).to.throw(Error, 'Ip2geoGeocoder needs an apiKey');
            });

            test('Should be an instance of Ip2geoGeocoder', () => {
                var geocoder = new Ip2geoGeocoder(mockedHttpAdapter, {apiKey: 'test'});
                geocoder.should.be.instanceof(Ip2geoGeocoder);
            });
        });

        describe('#geocode', () => {
            test('Should not accept address', () => {
                var geocoder = new Ip2geoGeocoder(mockedHttpAdapter, {apiKey: 'test'});
                expect(function() {geocoder.geocode('1 rue test');})
                    .to.throw(Error, 'Ip2geoGeocoder does not support geocoding address');
            });

            test('Should call httpAdapter get method', () => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var geocoder = new Ip2geoGeocoder(mockedHttpAdapter, {apiKey: 'test'});
                geocoder.geocode('8.8.8.8');
                mock.verify();
            });

            test('Should return a geocoded address', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                    success: true,
                    data: {
                        ip: '8.8.8.8',
                        type: 'IPv4',
                        is_eu: false,
                        continent: {
                            name: 'North America',
                            code: 'NA',
                            geoname_id: 6255149,
                            country: {
                                name: 'United States',
                                code: 'US',
                                geoname_id: 6252001,
                                phone_code: '+1',
                                capital: 'Washington D.C.',
                                tld: '.us',
                                flag: { emoji: '', emoji_unicode: 'U+1F1FA U+1F1F8', img: 'https://flagcdn.com/us.svg' },
                                currency: { name: 'United States Dollar', code: 'USD', symbol: '$' },
                                subdivision: { name: 'California', code: 'CA' },
                                city: {
                                    name: 'Mountain View',
                                    latitude: 37.386,
                                    longitude: -122.0838,
                                    postal_code: '94035',
                                    geoname_id: 5375480,
                                    metro_code: 807,
                                    accuracy_radius: 1000,
                                    timezone: { name: 'America/Los_Angeles', time_now: '2026-04-05T10:30:00-07:00' }
                                }
                            }
                        },
                        asn: { number: 15169, name: 'Google LLC' },
                        registered_country: { name: 'United States', code: 'US', geoname_id: 6252001 }
                    }
                });

                var geocoder = new Ip2geoGeocoder(mockedHttpAdapter, {apiKey: 'test'});
                geocoder.geocode('8.8.8.8', function(err, results) {
                    err.should.to.equal(false);
                    results[0].ip.should.to.equal('8.8.8.8');
                    results[0].country.should.to.equal('United States');
                    results[0].countryCode.should.to.equal('US');
                    results[0].city.should.to.equal('Mountain View');
                    results[0].state.should.to.equal('California');
                    results[0].latitude.should.to.equal(37.386);
                    results[0].longitude.should.to.equal(-122.0838);
                    results[0].zipcode.should.to.equal('94035');
                    results[0].timeZone.should.to.equal('America/Los_Angeles');
                    results[0].asnNumber.should.to.equal(15169);
                    results[0].asnName.should.to.equal('Google LLC');
                    mock.verify();
                    done();
                });
            });
        });

        describe('#reverse', () => {
            test('Should throw an error', () => {
                var geocoder = new Ip2geoGeocoder(mockedHttpAdapter, {apiKey: 'test'});
                expect(function() {geocoder.reverse(10.0235, -2.3662);})
                    .to.throw(Error, 'Ip2geoGeocoder no support reverse geocoding');
            });
        });
    });
})();
