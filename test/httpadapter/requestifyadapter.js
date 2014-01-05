'use strict';
(function() {
    var chai = require('chai'),
        should = chai.should(),
        sinon = require('sinon');

    var RequestifyAdapter = require('../../lib/httpadapter/requestifyadapter.js');


    describe('RequestifyAdapter', function() {

        describe('#constructor' , function() {

            it('if no requestify client specified must instanciate one', function() {

                var requestify = require('requestify');

                var requestifyAdapter = new RequestifyAdapter();

                requestifyAdapter.requestify.should.equal(requestify);

            });

            it('if client specified must use it', function() {
                var mockedClient = {'test' : 1};

                var requestifyAdapter = new RequestifyAdapter(mockedClient);

                requestifyAdapter.requestify.should.equal(mockedClient);
            });

        });

        describe('#get' , function() {

            it('get must call requestify get', function() {

                var requestify = { get: function () {} };
                var mock = sinon.mock(requestify);
                mock.expects('get').once().returns({then: function() {}});

                var requestifyAdapter = new RequestifyAdapter(requestify);

                requestifyAdapter.get('http://test.fr');

                mock.verify();
            });

        });

    });

})();