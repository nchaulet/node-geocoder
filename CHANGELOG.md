# Changelog

## 1.1.0

* add google geocoder language option

## 1.2.0

* add openStreetmap geocoder language option
* improve http error handling

## 1.3.0

* add host options for datasciencetoolkit
* improve tests

## 1.4.0

* Added support for the ESRI AGOL geocoding service
* Included test coverage for the new geocoder

## 2.0.0

* remove requestify http adapter
* Now support Promise API (using Q)

## 2.0.1

* fix bugs
* add https adapter

## 2.1.0

* add openmapquest geocoder

## 2.1.1

* Fix bugs

## 2.2.0

* add tomtom geocoder

## 2.3.0

* init command line

## 2.4.0

* use commander for command line

## 2.5.0

* add abstract geocoder for better code factorization
* Init google geocoder filtering (to document)

## 2.6.0

* add openstreetmap nominatim

## 2.7.0

* improve http error handling

## 2.8.0

* add opencage geocoder (http://geocoder.opencagedata.com/)

## 2.8.1

* fix openstreetmap reverse method

## 2.8.2

* fix openstreetmap typo

## 2.9.0

* add smarty streets geocoder

## 2.9.1

* add ValueError

## 2.9.2

* add state field to openstreet map geocoder

## 2.10.0

* add extra.region to google geocoder
* better error handling

## 2.11.0

* remove node 0.8 supports
* fix open street map street name

## 2.11.1

* Fix open street map state

# 2.12.0

* reverse geocoder command

## 2.12.1

* fix factory type

## 2.13.0

* add batchGeocode

## 2.13.1

* fix agol geocoder

## 2.13.2

* fix agol geocoder

## 2.14.0

* improve batch geocode

## 2.15.0

* better https requirements system

## 2.15.1

* fix camel case error

## 2.16.0

* add county (only on opencage)

## 2.16.1

* fix some bugs on google geocoder (no result, now return an empty arrray)

## 2.17.0

* new index syntax (getGeocoder is deprecated)

## 2.18.0

* Refacto on nominatim geocoder, refacto on abstract geocoder, add raw response to results

## 2.18.2

* fix leak, and duplicate code

## 2.19.0

* Made first argument of `reverse` a query object (`lat, lon` is deprecated)
* Extended options on nominatim-based geocoders (MapQuestGeocoder, NominatimMapquestGeocoder)

## 2.19.1

* add village or hamlet in key city

## 2.20.0

* add googlePlaceId and formattedAdress

## 2.21.0

* geocodio geocoder
* confidence extra property

## 2.22.0

* yandex geocoder
* default https adapter

## 2.23.0

* google geocoder administrativeLevel


