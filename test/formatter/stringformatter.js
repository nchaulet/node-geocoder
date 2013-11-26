(function() {
    var chai = require('chai'),
        should = chai.should(),
        expect = chai.expect;

    var StringFormatter = require('../../lib/formatter/stringformatter.js');

    describe('StringFormatter', function() {

        describe('#constructor' , function() {

            it('a string pattern must be set', function() {

                expect(function() {new StringFormatter();}).to.throw(Error, 'StringFormatter need a pattern');
            });
        });

        describe('#format' , function() {
            it('should replace pattern with correct values', function() {
                var formatter = new StringFormatter('%P %p %n %S %z %T %t');

                var results = formatter.format([{
                    country: 'France',
                    countryCode: 'FR',
                    streetNumber: 29,
                    streetName: 'rue chevreul',
                    zipcode: '69007',
                    state: 'Rhone alpes',
                    stateCode: 'RA'
                }]);

                results.should.have.length(1);
                var string = results[0];

                string.should.be.a('string');
                string.should.equal('France FR 29 rue chevreul 69007 Rhone alpes RA');
            });
        });

    });

})();