import { GpxFormatter } from './gpxformatter';

describe('GpxFormatter', () => {
  describe('#format', () => {
    test('should format using gpx format', () => {
      const formatter = new GpxFormatter();

      const results = formatter.format([
        {
          latitude: 40.714232,
          longitude: -73.9612889
        }
      ]);
      expect(results).toMatchInlineSnapshot(`
"<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" creator="geocoder.js"><wpt lat="40.714232" lon="-73.9612889"><name></name></wpt></gpx>"
`);
    });
  });
});
