var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var TeleportGeocoder = function TeleportGeocoder(httpAdapter, options) {
  TeleportGeocoder.super_.call(this, httpAdapter, options);

  var base = 'https://api.teleport.org/api';
  this._cities_endpoint = base + '/cities/';
  this._locations_endpoint = base + '/locations/';
};

util.inherits(TeleportGeocoder, AbstractGeocoder);

function getEmbeddedPath(parent, path) {
  var elements = path.split('/');
  for ( var i in elements) {
    var element = elements[i];
    var embedded = parent._embedded;
    if (!embedded) {
      return undefined;
    }
    var child = embedded[element];
    if (!child) {
      return undefined;
    }
    parent = child;
  }
  return parent;
}

/**
 * Geocode
 *
 * @param <string>    value     Value to geocode (Address)
 * @param <function>  callback  Callback method
 */
TeleportGeocoder.prototype._geocode = function(value, callback) {
  var _this = this;

  var params = {};
  params.search = value;
  params.embed = 'city:search-results/city:item/{city:country,city:admin1_division,city:urban_area}';

  this.httpAdapter.get(this._cities_endpoint, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      if (result) {
        var searchResults = getEmbeddedPath(result, 'city:search-results') || [];
        for (var i in searchResults) {
          var confidence = (25 - i) / 25.0 * 10;
          results.push(_this._formatResult(searchResults[i], 'city:item', confidence));
        }
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

TeleportGeocoder.prototype._formatResult = function(result, cityRelationName, confidence) {
  var city = getEmbeddedPath(result, cityRelationName);
  var admin1 = getEmbeddedPath(city, 'city:admin1_division') || {};
  var country = getEmbeddedPath(city, 'city:country') || {};
  var urban_area = getEmbeddedPath(city, 'city:urban_area') || {};
  var urban_area_links = urban_area._links || {};
  var extra = {
    confidence: confidence,
    urban_area: urban_area.name,
    urban_area_api_url: (urban_area_links.self || {}).href,
    urban_area_web_url: urban_area.teleport_city_url
  };
  if (result.distance_km) {
    extra.distance_km = result.distance_km;
  }
  if (result.matching_full_name) {
    extra.matching_full_name = result.matching_full_name;
  }

  return {
    'latitude': city.location.latlon.latitude,
    'longitude': city.location.latlon.longitude,
    'city': city.name,
    'country': country.name,
    'countryCode': country.iso_alpha2,
    'state': admin1.name,
    'stateCode': admin1.geonames_admin1_code,
    'extra': extra
  };
};

/**
 * Reverse geocoding
 *
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback          Callback method
 */
TeleportGeocoder.prototype._reverse = function(query, callback) {
  var lat = query.lat;
  var lng = query.lon;
  var suffix = lat + ',' + lng;

  var _this = this;

  var params = {};
  params.embed = 'location:nearest-cities/location:nearest-city/{city:country,city:admin1_division,city:urban_area}';

  this.httpAdapter.get(this._locations_endpoint + suffix, params, function(err, result) {
    if (err) {
      throw err;
    } else {
      var results = [];

      if (result) {
        var searchResults = getEmbeddedPath(result, 'location:nearest-cities') || [];
        for ( var i in searchResults) {
          var searchResult = searchResults[i];
          var confidence = Math.max(0, 25 - searchResult.distance_km) / 25 * 10;
          results.push(_this._formatResult(searchResult, 'location:nearest-city', confidence));
        }
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

module.exports = TeleportGeocoder;
