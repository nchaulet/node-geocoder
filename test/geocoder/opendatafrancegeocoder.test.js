(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var OpendataFranceGeocoder = require('../../lib/geocoder/opendatafrancegeocoder.js');

    var mockedHttpAdapter = {
        get: function() {}
    };

    describe('OpendataFranceGeocoder', () => {

        describe('#constructor' , () => {

            test('an http adapter must be set', () => {

                expect(function() {new OpendataFranceGeocoder();}).to.throw(Error, 'OpendataFranceGeocoder need an httpAdapter');
            });

            test('Should be an instance of OpendataFranceGeocoder', () => {

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                openDataFranceGeocoder.should.be.instanceof(OpendataFranceGeocoder);
            });

        });

        describe('#geocode' , () => {

            test('Should not accept IPv4', () => {

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                expect(function() {
                        openDataFranceGeocoder.geocode('127.0.0.1');
                }).to.throw(Error, 'OpendataFranceGeocoder does not support geocoding IPv4');

            });

            test('Should not accept IPv6', () => {

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                expect(function() {
                        openDataFranceGeocoder.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'OpendataFranceGeocoder does not support geocoding IPv6');

            });

            test('Should call httpAdapter get method', () => {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                openDataFranceGeocoder.geocode('1 champs élysée Paris');

                mock.verify();

            });

            test('Should return geocoded address with string', done => {
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

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                openDataFranceGeocoder.geocode('1 Rue David d\'Angers', function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        latitude: 48.88313,
                        longitude: 2.388491,
                        country: 'France',
                        state: '75, Île-de-France',
                        city: 'Paris',
                        zipcode: '75019',
                        streetName: 'Rue David d\'Angers',
                        streetNumber: '1',
                        countryCode: 'FR',
                        citycode: '75119',
                        id: 'ADRNIVX_0000000270725006',
                        type: 'housenumber'
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

            test('Should return geocoded address with object', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                  "limit": 20,
                  "center": [
                    47.4712,
                    -0.554003
                  ],
                  "attribution": "BAN",
                  "version": "draft",
                  "licence": "ODbL 1.0",
                  "query": "1 Rue David d'Angers",
                  "type": "FeatureCollection",
                  "features": [
                    {
                      "geometry": {
                        "type": "Point",
                        "coordinates": [
                          -0.550624,
                          47.472086
                        ]
                      },
                      "properties": {
                        "street": "Rue David d'Angers",
                        "label": "1 Rue David d'Angers 49100 Angers",
                        "distance": 272,
                        "context": "49, Maine-et-Loire, Pays de la Loire",
                        "id": "ADRNIVX_0000000263522758",
                        "citycode": "49007",
                        "name": "1 Rue David d'Angers",
                        "city": "Angers",
                        "postcode": "49100",
                        "housenumber": "1",
                        "score": 0.8585141961673092,
                        "type": "housenumber"
                      },
                      "type": "Feature"
                    }
                  ]
                }
                );

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                var queryToGeocode = {
                  address: '1 Rue David d\'Angers',
                  zipcode: '49000',
                  type: 'street',
                  lat: 47.4712,
                  lon: -0.554003,
                  limit: 20
                };

                openDataFranceGeocoder.geocode(queryToGeocode, function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        latitude: 47.472086,
                        longitude: -0.550624,
                        country: 'France',
                        state: '49, Maine-et-Loire, Pays de la Loire',
                        city: 'Angers',
                        zipcode: '49100',
                        streetName: 'Rue David d\'Angers',
                        streetNumber: '1',
                        countryCode: 'FR',
                        citycode: '49007',
                        id: 'ADRNIVX_0000000263522758',
                        type: 'housenumber'
                    });

                    results.raw.should.deep.equal({
                      "limit": 20,
                      "center": [
                        47.4712,
                        -0.554003
                      ],
                      "attribution": "BAN",
                      "version": "draft",
                      "licence": "ODbL 1.0",
                      "query": "1 Rue David d'Angers",
                      "type": "FeatureCollection",
                      "features": [
                        {
                          "geometry": {
                            "type": "Point",
                            "coordinates": [
                              -0.550624,
                              47.472086
                            ]
                          },
                          "properties": {
                            "street": "Rue David d'Angers",
                            "label": "1 Rue David d'Angers 49100 Angers",
                            "distance": 272,
                            "context": "49, Maine-et-Loire, Pays de la Loire",
                            "id": "ADRNIVX_0000000263522758",
                            "citycode": "49007",
                            "name": "1 Rue David d'Angers",
                            "city": "Angers",
                            "postcode": "49100",
                            "housenumber": "1",
                            "score": 0.8585141961673092,
                            "type": "housenumber"
                          },
                          "type": "Feature"
                        }
                      ]
                    });

                    mock.verify();
                    done();
                });
            });

            test('Should return geocoded address with type city', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                    "limit": 1,
                    "filters": {
                      "type": "city"
                    },
                    "attribution": "BAN",
                    "version": "draft",
                    "licence": "ODbL 1.0",
                    "query": "Plessis",
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            2.262349,
                            48.782912
                          ]
                        },
                        "properties": {
                          "citycode": "92060",
                          "adm_weight": "2",
                          "name": "Le Plessis-Robinson",
                          "city": "Le Plessis-Robinson",
                          "postcode": "92350",
                          "context": "92, Hauts-de-Seine, Île-de-France",
                          "score": 0.6722272727272727,
                          "label": "Le Plessis-Robinson",
                          "id": "92060",
                          "type": "city",
                          "population": "26.6"
                        },
                        "type": "Feature"
                      }
                    ]
                  }
                );

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                var queryToGeocode = {
                  address: 'Plessis',
                  type: 'city',
                  limit: 1
                };

                openDataFranceGeocoder.geocode(queryToGeocode, function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        latitude: 48.782912,
                        longitude: 2.262349,
                        country: 'France',
                        state: '92, Hauts-de-Seine, Île-de-France',
                        city: 'Le Plessis-Robinson',
                        zipcode: '92350',
                        citycode: '92060',
                        countryCode: 'FR',
                        type: 'city',
                        population: '26.6',
                        id: '92060',
                        adm_weight: '2'
                    });

                    mock.verify();
                    done();
                });
            });

            test('Should return geocoded address with type locality', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                    "limit": 1,
                    "filters": {
                      "type": "locality"
                    },
                    "attribution": "BAN",
                    "version": "draft",
                    "licence": "ODbL 1.0",
                    "query": "Plessis",
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            -2.134949,
                            47.666011
                          ]
                        },
                        "properties": {
                          "citycode": "56001",
                          "postcode": "56350",
                          "name": "Plessis-Rivault",
                          "city": "Allaire",
                          "context": "56, Morbihan, Bretagne",
                          "score": 0.8246272727272728,
                          "label": "Plessis-Rivault 56350 Allaire",
                          "id": "56001_D393_0c0627",
                          "type": "locality"
                        },
                        "type": "Feature"
                      }
                    ]
                  }
                );

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                var queryToGeocode = {
                  address: 'Plessis',
                  type: 'locality',
                  limit: 1
                };

                openDataFranceGeocoder.geocode(queryToGeocode, function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        latitude: 47.666011,
                        longitude: -2.134949,
                        country: 'France',
                        state: '56, Morbihan, Bretagne',
                        city: 'Allaire',
                        streetName: 'Plessis-Rivault',
                        zipcode: '56350',
                        citycode: '56001',
                        countryCode: 'FR',
                        type: 'locality',
                        id: '56001_D393_0c0627'
                    });

                    mock.verify();
                    done();
                });
            });

            test('Should return geocoded address with type village', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, {
                    "limit": 1,
                    "filters": {
                      "type": "village"
                    },
                    "attribution": "BAN",
                    "version": "draft",
                    "licence": "ODbL 1.0",
                    "query": "1 Rue Plessis",
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            2.831393,
                            49.578021
                          ]
                        },
                        "properties": {
                          "citycode": "60499",
                          "adm_weight": "1",
                          "name": "Plessis-de-Roye",
                          "city": "Plessis-de-Roye",
                          "postcode": "60310",
                          "context": "60, Oise, Picardie",
                          "score": 0.4108585858585858,
                          "label": "Plessis-de-Roye",
                          "id": "60499",
                          "type": "village",
                          "population": "0.2"
                        },
                        "type": "Feature"
                      }
                    ]
                  }
                );

                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);

                var queryToGeocode = {
                  address: 'Plessis',
                  type: 'village',
                  limit: 1
                };

                openDataFranceGeocoder.geocode(queryToGeocode, function(err, results) {
                    mock.verify();

                    err.should.to.equal(false);

                    results[0].should.to.deep.equal({
                        latitude: 49.578021,
                        longitude: 2.831393,
                        country: 'France',
                        state: '60, Oise, Picardie',
                        city: 'Plessis-de-Roye',
                        zipcode: '60310',
                        citycode: '60499',
                        countryCode: 'FR',
                        type: 'village',
                        id: '60499',
                        population: '0.2'
                    });

                    mock.verify();
                    done();
                });
            });

        });

        describe('#reverse' , () => {
            test('Should return geocoded address', done => {
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
                var openDataFranceGeocoder = new OpendataFranceGeocoder(mockedHttpAdapter);
                openDataFranceGeocoder.reverse({lat: 47.46653, lon: -0.550142}, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            latitude: 47.46653,
                            longitude: -0.54994,
                            country: 'France',
                            state: '49, Maine-et-Loire, Pays de la Loire',
                            city: 'Angers',
                            zipcode: '49100',
                            streetName: 'Rue Chateaugontier',
                            streetNumber: '16',
                            countryCode: 'FR',
                            citycode: '49007',
                            id: '49007_1720_665e82',
                            type: 'housenumber'
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
