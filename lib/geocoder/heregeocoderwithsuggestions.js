/**
 * Created by caliskan on 15.02.17.
 */

var util = require('util'),
  HereGeocoder = require('./heregeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (appId, appCode, language, politicalView, country, state)
 */
var HereGeocoderWithSuggestions = function HereGeocoderWithSuggestions(httpAdapter, options) {
  this.options = ['appId', 'appCode', 'language', 'politicalView', 'country', 'state'];

  HereGeocoderWithSuggestions.super_.call(this, httpAdapter, options);
};

util.inherits(HereGeocoderWithSuggestions, HereGeocoder);

// Here geocoder suggestion API endpoint
HereGeocoderWithSuggestions.prototype._suggestionsEndpoint = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json';

/**
 * Geocode
 * @param <string>   value    Value to geocode
 * @param <function> callback Callback method
 */
HereGeocoderWithSuggestions.prototype._geocode = function (value, callback) {
  var params = this._prepareQueryString();

  if (value.query) {
    params.query = value.query;
    if (value.country) {
      params.country = value.country;
    }
  } else {
    params.query = value;
  }

  var self = this;
  var geocodeResults = [];
  geocodeResults.raw = [];
  var suggestionsLength = 0;

  // first get some suggestions
  this.httpAdapter.get(this._suggestionsEndpoint, params, getSuggestions);

  function getSuggestions (err, result) {
    if (err) {
      return callback(err, result);
    } else {
      suggestionsLength = result.suggestions.length;

      if (0 === suggestionsLength) {
        return callback(false, geocodeResults);
      }

      // geocode each suggestion with its locationId, so that lat/lng is available
      result.suggestions.forEach(function (item) {
        HereGeocoder.prototype._geocode.call(self, {locationId: item.locationId}, formatSuggestions);
      });
    }
  }

  function formatSuggestions (err, result) {
    if (err) {
      return callback(err, result);
    } else {
      geocodeResults.push(result[0]);
      geocodeResults.raw.push(result.raw);

      if (geocodeResults.length === suggestionsLength) {
        return callback(false, geocodeResults);
      }
    }
  }
}

module.exports = HereGeocoderWithSuggestions;
