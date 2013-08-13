(function() {
    var chai = require('chai'),
        should = chai.should()
        expect = chai.expect;

    var RequestifyAdapter = require('../../lib/httpadapter/requestifyadapter.js');


    describe('RequestifyAdapter', function() {

        beforeEach(function() {

        });

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

    });

})();