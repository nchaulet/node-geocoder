'use strict';

import { StringFormatter } from './stringformatter';

describe('StringFormatter', () => {
  describe('#constructor', () => {
    test('a string pattern must be set', () => {
      expect(function () {
        // @ts-expect-error
        new StringFormatter();
      }).toThrow(/StringFormatter need a pattern/);
    });
  });
  describe('#format', () => {
    test('should replace pattern with correct values', () => {
      const formatter = new StringFormatter('%P %p %n %S %z %T %t %c');

      const results = formatter.format([
        {
          country: 'France',
          countryCode: 'FR',
          streetNumber: 29,
          streetName: 'rue chevreul',
          zipcode: '69007',
          state: 'Rhone alpes',
          stateCode: 'RA',
          city: 'Lyon'
        }
      ]);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(
        'France FR 29 rue chevreul 69007 Rhone alpes RA Lyon'
      );
    });
  });
});
