(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var OpendataFranceGeocoder = require('../../lib/geocoder/opendatafrancegeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('OpendataFranceGeocoder', function() {

        describe('#constructor' , function() {

            it('an http adapter must be set', function() {

                expect(function() {new OpendataFranceGeocoder();}).to.throw(Error, 'OpendataFranceGeocoder need an httpAdapter');
            });

            it('Should be an instance of OpendataFranceGeocoder', function() {

                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);

                osmAdapter.should.be.instanceof(OpendataFranceGeocoder);
            });

        });

        describe('#geocode' , function() {

            it('Should not accept IPv4', function() {

                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'OpendataFranceGeocoder does not support geocoding IPv4');

            });

            it('Should not accept IPv6', function() {

                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);

                expect(function() {
                        osmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'OpendataFranceGeocoder does not support geocoding IPv6');

            });

            it('Should call httpAdapter get method', function() {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('1 champs élysée Paris');

                mock.verify();

            });

            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                  "licence": "ODbL 1.0",
                  "type": "FeatureCollection",
                  "attribution": "BAN",
                  "limit": 5,
                  "features": [
                    {
                      "properties": {
                        "score": 0.8551727272727272,
                        "citycode": "75119",
                        "postcode": "75019",
                        "type": "housenumber",
                        "name": "1 Rue David d'Angers",
                        "city": "Paris",
                        "housenumber": "1",
                        "context": "75, Île-de-France",
                        "street": "Rue David d'Angers",
                        "id": "ADRNIVX_0000000270725006",
                        "label": "1 Rue David d'Angers 75019 Paris"
                      },
                      "geometry": {
                        "coordinates": [
                          2.388491,
                          48.88313
                        ],
                        "type": "Point"
                      },
                      "type": "Feature"
                    }
                  ],
                  "version": "draft",
                  "query": "1 rue david d'angers"
                }
                );

                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);

                osmAdapter.geocode('135 pilkington avenue, birmingham', function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        "latitude": 48.88313,
                        "longitude": 2.388491,
                        "country": "France",
						            "state": "75, Île-de-France",
                        "city": "Paris",
                        "zipcode": "75019",
                        "streetName": "Rue David d'Angers",
                        "streetNumber": "1",
                        "countryCode": "FR"
                    });

                    results.raw.should.deep.equal({
                      "licence": "ODbL 1.0",
                      "type": "FeatureCollection",
                      "attribution": "BAN",
                      "limit": 5,
                      "features": [
                        {
                          "properties": {
                            "score": 0.8551727272727272,
                            "citycode": "75119",
                            "postcode": "75019",
                            "type": "housenumber",
                            "name": "1 Rue David d'Angers",
                            "city": "Paris",
                            "housenumber": "1",
                            "context": "75, Île-de-France",
                            "street": "Rue David d'Angers",
                            "id": "ADRNIVX_0000000270725006",
                            "label": "1 Rue David d'Angers 75019 Paris"
                          },
                          "geometry": {
                            "coordinates": [
                              2.388491,
                              48.88313
                            ],
                            "type": "Point"
                          },
                          "type": "Feature"
                        }
                      ],
                      "version": "draft",
                      "query": "1 rue david d'angers"
                    });

                    mock.verify();
                    done();
                });
            });
        });

        describe('#reverse' , function() {
            it('Should return geocoded address', function(done) {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                    "licence": "ODbL 1.0",
                    "type": "FeatureCollection",
                    "attribution": "BAN",
                    "limit": 1,
                    "features": [
                      {
                        "properties": {
                          "score": 0.9999998584949208,
                          "postcode": "49100",
                          "housenumber": "16",
                          "street": "Rue Chateaugontier",
                          "context": "49, Maine-et-Loire, Pays de la Loire",
                          "citycode": "49007",
                          "type": "housenumber",
                          "city": "Angers",
                          "name": "16 Rue Chateaugontier",
                          "label": "16 Rue Chateaugontier 49100 Angers",
                          "id": "49007_1720_665e82",
                          "distance": 18
                        },
                        "geometry": {
                          "coordinates": [
                            -0.54994,
                            47.46653
                          ],
                          "type": "Point"
                        },
                        "type": "Feature"
                      }
                    ],
                    "version": "draft"
                  }
                );
                var osmAdapter = new OpendataFranceGeocoder(mockedHttpAdapter);
                osmAdapter.reverse({lat: 47.46653, lon: -0.550142}, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            "latitude": 47.46653,
                            "longitude": -0.54994,
                            "country": "France",
                            "state": "49, Maine-et-Loire, Pays de la Loire",
                            "city": "Angers",
                            "zipcode": "49100",
                            "streetName": "Rue Chateaugontier",
                            "streetNumber": "16",
                            "countryCode": "FR"
                        });
                        results.raw.should.deep.equal({
                          "licence": "ODbL 1.0",
                          "type": "FeatureCollection",
                          "attribution": "BAN",
                          "limit": 1,
                          "features": [
                            {
                              "properties": {
                                "score": 0.9999998584949208,
                                "postcode": "49100",
                                "housenumber": "16",
                                "street": "Rue Chateaugontier",
                                "context": "49, Maine-et-Loire, Pays de la Loire",
                                "citycode": "49007",
                                "type": "housenumber",
                                "city": "Angers",
                                "name": "16 Rue Chateaugontier",
                                "label": "16 Rue Chateaugontier 49100 Angers",
                                "id": "49007_1720_665e82",
                                "distance": 18
                              },
                              "geometry": {
                                "coordinates": [
                                  -0.54994,
                                  47.46653
                                ],
                                "type": "Point"
                              },
                              "type": "Feature"
                            }
                          ],
                          "version": "draft"
                        });

                        mock.verify();
                        done();
                });
            });
        });
    });
})();
