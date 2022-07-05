const NodeGeocoder = require('../../index');

describe('Google geocoder', () => {
  let geocoder;

  beforeAll(() => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const options = {
      provider: 'google',
      apiKey
    };

    if (!apiKey || apiKey === '') {
      throw new Error('GOOGLE_API_KEY not configured');
    }

    geocoder = NodeGeocoder(options);
  });

  describe('geocode', () => {
    it('works', async () => {
      const res = await geocoder.geocode('1231 Avenue Lajoie, Montreal');
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5210619,
        longitude: -73.61070029999999,
        formattedAddress: '1231 Av. Lajoie, Outremont, QC H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Montréal',
        zipcode: 'H2V 1P2'
      });
    });
  });

  describe('reverse', () => {
    it('works', async () => {
      const res = await geocoder.reverse({ lat: 45.521056, lon: -73.610734 });
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5210619,
        longitude: -73.61070029999999,
        formattedAddress: '1231 Av. Lajoie, Outremont, QC H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Montréal',
        zipcode: 'H2V 1P2'
      });
    });
  });
});
