const NodeGeocoder = require('../../index');

describe('Mapbox geocoder', () => {
  let geocoder;

  beforeAll(() => {
    const apiKey = process.env.MAPBOX_API_KEY;
    const options = {
      provider: 'mapbox',
      apiKey
    };

    if (!apiKey || apiKey === '') {
      throw new Error('MAPBOX_API_KEY not configured');
    }

    geocoder = NodeGeocoder(options);
  });

  describe('geocode', () => {
    it('works', async () => {
      const res = await geocoder.geocode('1231 Av. Lajoie, Montreal');

      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.521056,
        longitude: -73.610734,
        formattedAddress:
          '1231 Avenue Lajoie, Montréal, Quebec H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        state: 'Quebec',
        city: 'Montréal',
        zipcode: 'H2V 1P2',
        neighbourhood: 'Outremont'
      });
    });
  });

  describe('reverse', () => {
    it('works', async () => {
      const res = await geocoder.reverse({ lat: 45.521056, lon: -73.610734 });
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.52105585,
        longitude: -73.61073425,
        formattedAddress:
          '1231 Avenue Lajoie, Montréal, Quebec H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        state: 'Quebec',
        city: 'Montréal',
        zipcode: 'H2V 1P2',
        neighbourhood: 'Outremont'
      });
    });
  });
});
