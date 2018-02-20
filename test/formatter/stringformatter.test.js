'use strict';

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var StringFormatter = require('../../lib/formatter/stringformatter.js');

describe('StringFormatter', () => {
  describe('#constructor' , () => {
    test('a string pattern must be set', () => {
      expect(function() {new StringFormatter();}).to.throw(Error, 'StringFormatter need a pattern');
    });
  });
  describe('#format' , () => {
    test('should replace pattern with correct values', () => {
      var formatter = new StringFormatter('%P %p %n %S %z %T %t %c');

      var results = formatter.format([{
        country: 'France',
        countryCode: 'FR',
        streetNumber: 29,
        streetName: 'rue chevreul',
        zipcode: '69007',
        state: 'Rhone alpes',
        stateCode: 'RA',
        city: 'Lyon',
      }]);

      results.should.have.length(1);
      var string = results[0];

      string.should.be.a('string');
      string.should.equal('France FR 29 rue chevreul 69007 Rhone alpes RA Lyon');
    });
  });
});

