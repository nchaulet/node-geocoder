import { Geocoder, getGeocoder } from '../../src/';

const apiKey = process.env.GOOGLE_API_KEY;
const testDescription = apiKey ? describe : describe.skip;

testDescription('Google geocoder', () => {
  let geocoder: Geocoder;

  beforeAll(() => {
    const options = {
      provider: 'google',
      apiKey
    };

    geocoder = getGeocoder('google', options);
  });

  describe('geocode', () => {
    it('works', async () => {
      const res = await geocoder.geocode('1231 Avenue Lajoie, Montreal');
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5210619,
        longitude: -73.61070029999999,
        formattedAddress: '1231 Av. Lajoie, Montréal, QC H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Montréal',
        zipcode: 'H2V 1P2'
      });
    });
  });

  describe('reverse', () => {
    it('works', async () => {
      const res = await geocoder.reverse({ lat: 45.521056, lon: -73.61073 });
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5210619,
        longitude: -73.61070029999999,
        formattedAddress: '1231 Av. Lajoie, Montréal, QC H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Montréal',
        zipcode: 'H2V 1P2'
      });
    });
  });
});
