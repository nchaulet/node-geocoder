## 3.0.0

- remove command line geocoder: now in node-geocoder-cli
- Remove getGeocoder from index module
- Add Here geocoder

## 3.0.2

- handle no result in openstreetmap reverse

## 3.2.0

- excludePartialMatches

## 3.3.0

- http adapter custom header
- apikey for nominatiom geocoder

## 3.4.0

- Teleport Geocoder

## 3.6.0

- Support search object for mapquest geocoder

## 3.6.1

- Fix opencage callback error
- Fix opencage confidence

## 3.8.0

- Opendata France geocoders
- Google neighboorhod
- Google fix Substitute character

## 3.9.1

- clean up algol geocoder
- fix opendata france geocoder

## 3.13.0

- add locationIQ geocoder

## 3.14.0

- support language, region as parameter of google geocoder

## 3.15.0

- supports request-promise as an adapter

## 3.16.0

- supports result_type and location_type for google geocoder

## 3.17.0

- supports mapzen

## 3.18.0

- Add PickPoint geocoder

## 3.19.0

- Add formattedAddress to the open street map geocoder

## 3.20.0

- fix yandex geocoder
- virtualearth geocoder

## 3.20.1

- Fix yandex geocoder

## 3.21.0

Add suppot for osmServer option

## 3.21.1

- Fix google geocoder gecoder with no country

## 3.22.0

- add reverse geocoder to bing geocoder.

## 3.23.0

- Fix tom tom geocoder to use new API.

## 3.24.0

- Fix tom tom geocoder to use new API.
- Fix production endpoint
- Drop node 4 and 6 support

# 3.25.0

- support yandex api Key

# 3.25.1

- fix yander parameter usage

# 3.26.0

- Introduce fetch option.
- Deprecate httpAdapters.

# 3.27,0

- Update here geocoder to support `apiKey`
- Allow passing of limit parameter to opendatafrance

# 3.28.0

- Fixed GeoCodio Object with formattedAddress and country (#322)
- Support language feature for open cage (#309)

# 3.29.0

- Add `mapbox` geocoder (#317)
- Improve error handling of non JSON error response (#324)
- Improve batch geocoding for TomTom (#325)
- Here batchGeocoding using the Here Batch API (#329)
- Integrations test for TomTom, Here and Mapbox

# 4.0.0

- Support nodejs >= 12
- Remove http adapter (#332)
- Remove deprecated option from here geocoder (#333)

# 4.1.0

- Changes to LocationIQ API URLs

# 4.2.0

- Handle unathorized error from HERE when a wrong API Key is provided. Related with: Crash with HereGeocoder when bad apiKey given #342
- Fix limit param for TomTom #342
