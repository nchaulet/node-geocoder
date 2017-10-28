(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        sinon = require('sinon');

    var HereGeocoder = require('../../lib/geocoder/heregeocoder.js');
    var HttpAdapter = require('../../lib/httpadapter/httpadapter.js');

    var mockedHttpAdapter = {
        get: function() {
          return {};
        },
        supportsHttps: function() {
            return true;
        }
    };

    describe('HereGeocoder', () => {

        describe('#constructor' , () => {
            test('an http adapter must be set', () => {
                expect(function() {new HereGeocoder();}).to.throw(Error, 'HereGeocoder need an httpAdapter');
            });

            test('requires appId and appCode to be specified', () => {
                expect(function() {new HereGeocoder(mockedHttpAdapter, {});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
                expect(function() {new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID'});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
                expect(function() {new HereGeocoder(mockedHttpAdapter, {appCode: 'APP_CODE'});}).to.throw(Error, 'You must specify appId and appCode to use Here Geocoder');
            });

            test(
                'Should be an instance of HereGeocoder if an http adapter, appId, and appCode are provided',
                () => {
                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                    hereAdapter.should.be.instanceof(HereGeocoder);
                }
            );
        });

        describe('#geocode' , () => {
            test('Should not accept IPv4', () => {

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                expect(function() {
                        hereAdapter.geocode('127.0.0.1');
                }).to.throw(Error, 'HereGeocoder does not support geocoding IPv4');

            });

            test('Should not accept IPv6', () => {

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                expect(function() {
                        hereAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
                }).to.throw(Error, 'HereGeocoder does not support geocoding IPv6');

            });

            test('Should call httpAdapter get method', () => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                    searchtext: "1 champs élysée Paris",
                    app_code: "APP_CODE",
                    app_id: "APP_ID",
                    additionaldata: "Country2,true",
                    gen: 8
                }).once().returns({then: function() {}});

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.geocode('1 champs élysée Paris');

                mock.verify();
            });

            test(
                'Should call httpAdapter get method with language if specified',
                () => {
                    var mock = sinon.mock(mockedHttpAdapter);
                    mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                        searchtext: "1 champs élysée Paris",
                        language: "en",
                        app_code: "APP_CODE",
                        app_id: "APP_ID",
                        additionaldata: "Country2,true",
                        gen: 8
                    }).once().returns({then: function() {}});

                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', language: 'en'});

                    hereAdapter.geocode('1 champs élysée Paris');

                    mock.verify();
                }
            );

            test(
                'Should call httpAdapter get method with politicalView if specified',
                () => {
                    var mock = sinon.mock(mockedHttpAdapter);
                    mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                        searchtext: "1 champs élysée Paris",
                        politicalview: "GRE",
                        app_code: "APP_CODE",
                        app_id: "APP_ID",
                        additionaldata: "Country2,true",
                        gen: 8
                    }).once().returns({then: function() {}});

                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', politicalView: 'GRE'});

                    hereAdapter.geocode('1 champs élysée Paris');

                    mock.verify();
                }
            );

            test(
                'Should call httpAdapter get method with country if specified',
                () => {
                    var mock = sinon.mock(mockedHttpAdapter);
                    mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                        searchtext: "1 champs élysée Paris",
                        country: "FR",
                        app_code: "APP_CODE",
                        app_id: "APP_ID",
                        additionaldata: "Country2,true",
                        gen: 8
                    }).once().returns({then: function() {}});

                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', country: 'FR'});

                    hereAdapter.geocode('1 champs élysée Paris');

                    mock.verify();
                }
            );

            test('Should call httpAdapter get method with state if specified', () => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                    searchtext: "1 champs élysée Paris",
                    state: "Île-de-France",
                    app_code: "APP_CODE",
                    app_id: "APP_ID",
                    additionaldata: "Country2,true",
                    gen: 8
                }).once().returns({then: function() {}});

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', state: 'Île-de-France'});

                hereAdapter.geocode('1 champs élysée Paris');

                mock.verify();
            });

            test(
                'Should call httpAdapter get method with components if called with object',
                () => {
                    var mock = sinon.mock(mockedHttpAdapter);
                    mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                        searchtext: "1 champs élysée Paris",
                        country: "FR",
                        postalcode: "75008",
                        app_code: "APP_CODE",
                        app_id: "APP_ID",
                        additionaldata: "Country2,true",
                        gen: 8
                    }).once().returns({then: function() {}});

                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                    hereAdapter.geocode({
                        address: '1 champs élysée Paris',
                        zipcode: '75008',
                        country: 'FR'
                    });

                    mock.verify();
                }
            );

            test(
                'Should call httpAdapter get method without default state if called with object containing country',
                () => {
                    var mock = sinon.mock(mockedHttpAdapter);
                    mock.expects('get').withArgs('https://geocoder.cit.api.here.com/6.2/geocode.json', {
                        searchtext: "Kaiserswerther Str 10, Berlin",
                        country: "DE",
                        app_code: "APP_CODE",
                        app_id: "APP_ID",
                        additionaldata: "Country2,true",
                        gen: 8
                    }).once().returns({then: function() {}});

                    var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE', country: 'FR', state: 'Île-de-France' });

                    hereAdapter.geocode({
                        address: 'Kaiserswerther Str 10, Berlin',
                        country: 'DE'
                    });

                    mock.verify();
                }
            );

            test('Should return geocoded address', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { Response:
                   { MetaInfo: { Timestamp: '2015-08-21T07:53:51.042+0000' },
                     View:
                      [ { _type: 'SearchResultsViewType',
                          ViewId: 0,
                          Result:
                           [ { Relevance: 1,
                               MatchLevel: 'houseNumber',
                               MatchQuality:
                                { City: 1,
                                  Street: [ 1 ],
                                  HouseNumber: 1 },
                               MatchType: 'pointAddress',
                               Location:
                                { LocationId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD',
                                  LocationType: 'address',
                                  DisplayPosition: { Latitude: 52.44841, Longitude: 13.28755 },
                                  NavigationPosition: [ { Latitude: 52.44854, Longitude: 13.2874 } ],
                                  MapView:
                                   { TopLeft:
                                      { Latitude: 52.4495342,
                                        Longitude: 13.2857055 },
                                     BottomRight:
                                      { Latitude: 52.4472858,
                                        Longitude: 13.2893945 } },
                                  Address:
                                   { Label: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                                     Country: 'DEU',
                                     State: 'Berlin',
                                     County: 'Berlin',
                                     City: 'Berlin',
                                     District: 'Dahlem',
                                     Street: 'Kaiserswerther Straße',
                                     HouseNumber: '10',
                                     PostalCode: '14195',
                                     AdditionalData:
                                      [ { value: 'DE', key: 'Country2' },
                                        { value: 'Deutschland', key: 'CountryName' },
                                        { value: 'Berlin', key: 'StateName' },
                                        { value: 'Berlin', key: 'CountyName' } ] } } } ] } ] } }
                );
                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.geocode('Kaiserswerther Str 10, Berlin', function(err, results) {
                    err.should.to.equal(false);
                    results[0].should.to.deep.equal({
                        formattedAddress: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                        latitude: 52.44841,
                        longitude: 13.28755,
                        country: 'Deutschland',
                        countryCode: 'DE',
                        state: 'Berlin',
                        county: 'Berlin',
                        city: 'Berlin',
                        zipcode: '14195',
                        district: 'Dahlem',
                        streetName: 'Kaiserswerther Straße',
                        streetNumber: '10',
                        building: null,
                        extra: { herePlaceId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD', confidence: 1 },
                        administrativeLevels: { level1long: 'Berlin', level2long: 'Berlin' }
                    });

                    results.raw.should.deep.equal({ Response:
                       { MetaInfo: { Timestamp: '2015-08-21T07:53:51.042+0000' },
                         View:
                          [ { _type: 'SearchResultsViewType',
                              ViewId: 0,
                              Result:
                               [ { Relevance: 1,
                                   MatchLevel: 'houseNumber',
                                   MatchQuality:
                                    { City: 1,
                                      Street: [ 1 ],
                                      HouseNumber: 1 },
                                   MatchType: 'pointAddress',
                                   Location:
                                    { LocationId: 'NT_l-pW8M-6wY8Ylp8zHdjc7C_xAD',
                                      LocationType: 'address',
                                      DisplayPosition: { Latitude: 52.44841, Longitude: 13.28755 },
                                      NavigationPosition: [ { Latitude: 52.44854, Longitude: 13.2874 } ],
                                      MapView:
                                       { TopLeft:
                                          { Latitude: 52.4495342,
                                            Longitude: 13.2857055 },
                                         BottomRight:
                                          { Latitude: 52.4472858,
                                            Longitude: 13.2893945 } },
                                      Address:
                                       { Label: 'Kaiserswerther Straße 10, 14195 Berlin, Deutschland',
                                         Country: 'DEU',
                                         State: 'Berlin',
                                         County: 'Berlin',
                                         City: 'Berlin',
                                         District: 'Dahlem',
                                         Street: 'Kaiserswerther Straße',
                                         HouseNumber: '10',
                                         PostalCode: '14195',
                                         AdditionalData:
                                          [ { value: 'DE', key: 'Country2' },
                                            { value: 'Deutschland', key: 'CountryName' },
                                            { value: 'Berlin', key: 'StateName' },
                                            { value: 'Berlin', key: 'CountyName' } ] } } } ] } ] } }
                    );

                    mock.verify();
                    done();
                });
            });

            test('Should handle a not "OK" status', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, new Error('Response status code is 401'), {
                    details: 'invalid credentials for APP_ID',
                    additionalData: [],
                    type: 'PermissionError',
                    subtype: 'InvalidCredentials'
                });

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.geocode('1 champs élysées Paris', function(err, results) {
                    err.message.should.to.equal("Response status code is 401");

                    results.raw.should.deep.equal({
                        details: 'invalid credentials for APP_ID',
                        additionalData: [],
                        type: 'PermissionError',
                        subtype: 'InvalidCredentials'
                    });

                    mock.verify();
                    done();
                });
            });

            test('Should handle an empty response', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { Response:
                       { MetaInfo: { Timestamp: '2015-08-21T07:53:52.120+0000' },
                         View:
                          [ { _type: 'SearchResultsViewType',
                              ViewId: 0,
                              Result: [] } ] } }
                );

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.geocode('1 champs élysées Paris', function(err, results) {
                    err.should.equal(false);

                    results.length.should.equal(0);

                    results.raw.should.deep.equal({ Response:
                       { MetaInfo: { Timestamp: '2015-08-21T07:53:52.120+0000' },
                         View:
                          [ { _type: 'SearchResultsViewType',
                              ViewId: 0,
                              Result: [] } ] } }
                    );

                    mock.verify();
                    done();
                });
            });

        });

        describe('#reverse' , () => {
            test('Should call httpAdapter get method', () => {

                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().returns({then: function() {}});

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.reverse({lat:10.0235,lon:-2.3662});

                mock.verify();

            });

            test('Should return geocoded address', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { Response:
                   { MetaInfo: { Timestamp: '2015-08-21T08:06:54.108+0000' },
                     View:
                      [ { _type: 'SearchResultsViewType',
                          ViewId: 0,
                          Result:
                           [ { Relevance: 0.86,
                               Distance: 14,
                               MatchLevel: 'street',
                               MatchQuality:
                                { Country: 1,
                                  State: 1,
                                  County: 1,
                                  City: 1,
                                  District: 1,
                                  Street: [ 1 ],
                                  PostalCode: 1 },
                               Location:
                                { LocationId: 'NT_mlPPLwmK3VpdUm-Z9Dq0GD_l_21619568_R',
                                  LocationType: 'address',
                                  DisplayPosition:
                                   { Latitude: 40.7143119,
                                     Longitude: -73.9614172 },
                                  NavigationPosition:
                                   [ { Latitude: 40.7143119,
                                       Longitude: -73.9614172 } ],
                                  MapView:
                                   { TopLeft: { Latitude: 40.71489, Longitude: -73.96168 },
                                     BottomRight: { Latitude: 40.71389, Longitude: -73.9609 } },
                                  Address:
                                   { Label: 'Bedford Ave, Brooklyn, NY 11211, United States',
                                     Country: 'USA',
                                     State: 'NY',
                                     County: 'Kings',
                                     City: 'Brooklyn',
                                     District: 'Williamsburg',
                                     Street: 'Bedford Ave',
                                     PostalCode: '11211',
                                     AdditionalData:
                                      [ { value: 'US', key: 'Country2' },
                                        { value: 'United States',
                                          key: 'CountryName' },
                                        { value: 'New York', key: 'StateName' },
                                        { value: 'Kings', key: 'CountyName' },
                                        { value: 'N', key: 'PostalCodeType' } ] },
                                  MapReference:
                                   { ReferenceId: '21619568',
                                     MapId: 'NAAM15134',
                                     MapVersion: 'Q1/2015',
                                     Spot: 0.69,
                                     SideOfStreet: 'right',
                                     CountryId: '21000001',
                                     StateId: '21010819',
                                     CountyId: '21019046' } } } ] } ] } }
                );

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
                        err.should.to.equal(false);
                        results[0].should.to.deep.equal({
                            formattedAddress: 'Bedford Ave, Brooklyn, NY 11211, United States',
                            latitude: 40.7143119,
                            longitude: -73.9614172,
                            country: 'United States',
                            countryCode: 'US',
                            state: 'New York',
                            county: 'Kings',
                            city: 'Brooklyn',
                            zipcode: '11211',
                            district: 'Williamsburg',
                            streetName: 'Bedford Ave',
                            streetNumber: null,
                            building: null,
                            extra:
                             { herePlaceId: 'NT_mlPPLwmK3VpdUm-Z9Dq0GD_l_21619568_R',
                               confidence: 0.86 },
                            administrativeLevels: { level1long: 'New York', level2long: 'Kings' }
                        });

                        results.raw.should.deep.equal({ Response:
                           { MetaInfo: { Timestamp: '2015-08-21T08:06:54.108+0000' },
                             View:
                              [ { _type: 'SearchResultsViewType',
                                  ViewId: 0,
                                  Result:
                                   [ { Relevance: 0.86,
                                       Distance: 14,
                                       MatchLevel: 'street',
                                       MatchQuality:
                                        { Country: 1,
                                          State: 1,
                                          County: 1,
                                          City: 1,
                                          District: 1,
                                          Street: [ 1 ],
                                          PostalCode: 1 },
                                       Location:
                                        { LocationId: 'NT_mlPPLwmK3VpdUm-Z9Dq0GD_l_21619568_R',
                                          LocationType: 'address',
                                          DisplayPosition:
                                           { Latitude: 40.7143119,
                                             Longitude: -73.9614172 },
                                          NavigationPosition:
                                           [ { Latitude: 40.7143119,
                                               Longitude: -73.9614172 } ],
                                          MapView:
                                           { TopLeft: { Latitude: 40.71489, Longitude: -73.96168 },
                                             BottomRight: { Latitude: 40.71389, Longitude: -73.9609 } },
                                          Address:
                                           { Label: 'Bedford Ave, Brooklyn, NY 11211, United States',
                                             Country: 'USA',
                                             State: 'NY',
                                             County: 'Kings',
                                             City: 'Brooklyn',
                                             District: 'Williamsburg',
                                             Street: 'Bedford Ave',
                                             PostalCode: '11211',
                                             AdditionalData:
                                              [ { value: 'US', key: 'Country2' },
                                                { value: 'United States',
                                                  key: 'CountryName' },
                                                { value: 'New York', key: 'StateName' },
                                                { value: 'Kings', key: 'CountyName' },
                                                { value: 'N', key: 'PostalCodeType' } ] },
                                          MapReference:
                                           { ReferenceId: '21619568',
                                             MapId: 'NAAM15134',
                                             MapVersion: 'Q1/2015',
                                             Spot: 0.69,
                                             SideOfStreet: 'right',
                                             CountryId: '21000001',
                                             StateId: '21010819',
                                             CountyId: '21019046' } } } ] } ] } }
                        );

                        mock.verify();
                        done();
                });
            });

            test('Should handle a not "OK" status', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, new Error('Response status code is 401'), {
                    details: 'invalid credentials for APP_ID',
                    additionalData: [],
                    type: 'PermissionError',
                    subtype: 'InvalidCredentials'
                });

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
                    err.message.should.to.equal("Response status code is 401");

                    results.raw.should.deep.equal({
                        details: 'invalid credentials for APP_ID',
                        additionalData: [],
                        type: 'PermissionError',
                        subtype: 'InvalidCredentials'
                    });

                    mock.verify();
                    done();
                });
            });

            test('Should handle an empty response', done => {
                var mock = sinon.mock(mockedHttpAdapter);
                mock.expects('get').once().callsArgWith(2, false, { Response:
                       { MetaInfo: { Timestamp: '2015-08-21T07:54:07.908+0000' },
                         View:
                          [ { _type: 'SearchResultsViewType',
                              ViewId: 0,
                              Result: [] } ] } }
                );

                var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'APP_ID', appCode: 'APP_CODE'});

                hereAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
                    err.should.equal(false);

                    results.length.should.equal(0);

                    results.raw.should.deep.equal({ Response:
                       { MetaInfo: { Timestamp: '2015-08-21T07:54:07.908+0000' },
                         View:
                          [ { _type: 'SearchResultsViewType',
                              ViewId: 0,
                              Result: [] } ] } }
                    );

                    mock.verify();
                    done();
                });
            });

        //     it('Should handle a not "OK" status', function(done) {
        //         var mock = sinon.mock(mockedHttpAdapter);
        //         mock.expects('get').once().callsArgWith(2, false, { status: "OVER_QUERY_LIMIT", error_message: "You have exceeded your rate-limit for this API.", results: [] });

        //         var hereAdapter = new HereGeocoder(mockedHttpAdapter);

        //         hereAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
        //             err.message.should.to.equal("Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.");
        //             mock.verify();
        //             done();
        //         });
        //     });

        //     it('Should handle a not "OK" status and no error_message', function(done) {
        //         var mock = sinon.mock(mockedHttpAdapter);
        //         mock.expects('get').once().callsArgWith(2, false, { status: "INVALID_REQUEST", results: [] });

        //         var hereAdapter = new HereGeocoder(mockedHttpAdapter);

        //         hereAdapter.reverse({lat:40.714232,lon:-73.9612889}, function(err, results) {
        //             err.message.should.to.equal("Status is INVALID_REQUEST.");
        //             mock.verify();
        //             done();
        //         });
        //     });

        //     it('Should call httpAdapter get method with signed url if appId and appCode specified', function() {
        //         var mock = sinon.mock(mockedHttpAdapter);
        //         mock.expects('get').withArgs('https://maps.hereapis.com/maps/api/geocode/json', {
        //             address: "1 champs élysée Paris",
        //             client: "raoul",
        //             sensor: false,
        //             signature: "PW1yyLFH9lN16B-Iw7EXiAeMKX8="
        //         }).once().returns({then: function() {}});

        //         var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'raoul', appCode: 'foo'});

        //         hereAdapter.geocode('1 champs élysée Paris');

        //         mock.verify();
        //     });

        //     it('Should generate signatures with all / characters replaced with _', function() {
        //         var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'james', appCode: 'foo'});
        //         var params = {
        //           sensor: false,
        //           client: 'james',
        //           address:  'qqslfzxytfr'
        //         };
        //         hereAdapter._signedRequest('https://maps.hereapis.com/maps/api/geocode/json', params);
        //         expect(params.signature).to.equal('ww_ja1wA8YBE_cfwmx9EQ_5y2pI=');
        //     });

        //     it('Should generate signatures with all + characters replaced with -', function() {
        //         var hereAdapter = new HereGeocoder(mockedHttpAdapter, {appId: 'james', appCode: 'foo'});
        //         var params = {
        //           sensor: false,
        //           client: 'james',
        //           address: 'lomxcefgkxr'
        //         };
        //         hereAdapter._signedRequest('https://maps.hereapis.com/maps/api/geocode/json', params);
        //         expect(params.signature).to.equal('zLXE-mmcsjp2RobIXjMd9h3P-zM=');
        //     });
        });

    });

})();
