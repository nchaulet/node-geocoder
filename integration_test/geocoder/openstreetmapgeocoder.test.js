const NodeGeocoder = require('../../index');

describe('Openstreetmap geocoder', () => {
  let geocoder;

  beforeAll(() => {
    const options = {
      provider: 'openstreetmap'
    };

    geocoder = NodeGeocoder(options);
  });

  describe('geocode', () => {
    it('works with basic value', async () => {
      const res = await geocoder.geocode('1231 Av. Lajoie, Montreal');

      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5209666,
        longitude: -73.6107766,
        country: 'Canada',
        countryCode: 'CA',
        state: 'Québec',
        city: 'Montréal'
      });
    });

    it('works with openstreetmap params', async () => {
      const res = await geocoder.geocode({
        q: '1231 Av. Lajoie, Montreal',
        limit: 2
      });

      expect(res).toHaveLength(2);
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5209666,
        longitude: -73.6107766,
        country: 'Canada',
        countryCode: 'CA',
        state: 'Québec',
        city: 'Montréal'
      });
    });
  });
});
