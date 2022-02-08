const NodeGeocoder = require('../../index');

describe('Mapbox geocoder', () => {
  let geocoder;

  beforeAll(() => {
    const apiKey = process.env.TOMTOM_API_KEY;
    const options = {
      provider: 'tomtom',
      apiKey
    };

    if (!apiKey || apiKey === '') {
      throw new Error('TOMTOM_API_KEY not configured');
    }

    geocoder = NodeGeocoder(options);
  });

  describe('geocode', () => {
    it('works', async () => {
      const res = await geocoder.geocode('1231 Av. Lajoie, Montreal');

      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.52106,
        longitude: -73.61073,
        country: 'Canada',
        countryCode: 'CA',
        state: 'QC',
        city: 'Outremont'
      });
    });
  });

  describe('batchGeocode', () => {
    it('works', async () => {
      const res = await geocoder.batchGeocode([
        '1231 Av. Lajoie, Montreal',
        '1432 av laurier montreal'
      ]);

      expect(res[0]).toBeDefined();
      expect(res[0].value[0]).toBeDefined();
      expect(res[0].value[0]).toMatchObject({
        latitude: 45.52106,
        longitude: -73.61073,
        country: 'Canada',
        countryCode: 'CA',
        state: 'QC',
        city: 'Outremont'
      });

      expect(res[1]).toBeDefined();
      expect(res[1].value[0]).toBeDefined();
      expect(res[1].value[0]).toMatchObject({
        latitude: 45.53383,
        longitude: -73.58328,
        country: 'Canada',
        countryCode: 'CA',
        state: 'QC',
        city: 'Montreal'
      });
    });
  });
});
