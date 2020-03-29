const AbstractGeocoder = require('./abstractgeocoder');

const OPTIONS = [
  'apiKey',
  'appId',
  'appCode',
  'language',
  'politicalView',
  'country',
  'state',
  'production'
];

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (appId, appCode, language, politicalView, country, state, production)
 */
class HereGeocoder extends AbstractGeocoder {
  constructor(httpAdapter, options) {
    super(httpAdapter, options);
    this.options = options;
    OPTIONS.forEach(option => {
      if (!options[option] || options[option] == 'undefined') {
        this.options[option] = null;
      }
    });

    // appId and appCode are deprecated
    if (!this.options.apiKey && !(this.options.appId && this.options.appCode)) {
      throw new Error('You must specify apiKey to use Here Geocoder');
    }
  }

  /**
   * Geocode
   * @param <string>   value    Value to geocode (Address)
   * @param <function> callback Callback method
   */
  _geocode(value, callback) {
    var _this = this;
    var params = this._prepareQueryString();

    if (value.address) {
      if (value.language) {
        params.language = value.language;
      }
      if (value.politicalView) {
        params.politicalview = value.politicalView;
      }
      if (value.country) {
        params.country = value.country;
        if (value.state) {
          params.state = value.state;
        } else {
          delete params.state;
        }
      }
      if (value.zipcode) {
        params.postalcode = value.zipcode;
      }
      params.searchtext = value.address;
    } else {
      params.searchtext = value;
    }

    this.httpAdapter.get(this._geocodeEndpoint, params, function(err, result) {
      var results = [];
      results.raw = result;

      if (err) {
        return callback(err, results);
      } else {
        var view = result.Response.View[0];
        if (!view) {
          return callback(false, results);
        }

        // Format each geocoding result
        results = view.Result.map(_this._formatResult);
        results.raw = result;

        callback(false, results);
      }
    });
  }

  /**
   * Reverse geocoding
   * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
   * @param <function> callback Callback method
   */
  _reverse(query, callback) {
    var lat = query.lat;
    var lng = query.lon;

    var _this = this;
    var params = this._prepareQueryString();
    params.pos = lat + ',' + lng;
    params.mode = 'trackPosition';

    this.httpAdapter.get(this._reverseEndpoint, params, function(err, result) {
      var results = [];
      results.raw = result;

      if (err) {
        return callback(err, results);
      } else {
        var view = result.Response.View[0];
        if (!view) {
          return callback(false, results);
        }

        // Format each geocoding result
        results = view.Result.map(_this._formatResult);
        results.raw = result;

        callback(false, results);
      }
    });
  }

  _formatResult(result) {
    var location = result.Location || {};
    var address = location.Address || {};
    var i;

    var extractedObj = {
      formattedAddress: address.Label || null,
      latitude: location.DisplayPosition.Latitude,
      longitude: location.DisplayPosition.Longitude,
      country: null,
      countryCode: address.Country || null,
      state: address.State || null,
      county: address.County || null,
      city: address.City || null,
      zipcode: address.PostalCode || null,
      district: address.District || null,
      streetName: address.Street || null,
      streetNumber: address.HouseNumber || null,
      building: address.Building || null,
      extra: {
        herePlaceId: location.LocationId || null,
        confidence: result.Relevance || 0
      },
      administrativeLevels: {}
    };

    for (i = 0; i < address.AdditionalData.length; i++) {
      var additionalData = address.AdditionalData[i];
      switch (additionalData.key) {
        //Country 2-digit code
        case 'Country2':
          extractedObj.countryCode = additionalData.value;
          break;
        //Country name
        case 'CountryName':
          extractedObj.country = additionalData.value;
          break;
        //State name
        case 'StateName':
          extractedObj.administrativeLevels.level1long = additionalData.value;
          extractedObj.state = additionalData.value;
          break;
        //County name
        case 'CountyName':
          extractedObj.administrativeLevels.level2long = additionalData.value;
          extractedObj.county = additionalData.value;
      }
    }

    return extractedObj;
  }
  _prepareQueryString() {
    var params = {
      additionaldata: 'Country2,true',
      gen: 8
    };

    // Deprecated
    if (this.options.appId) {
      params.app_id = this.options.appId;
    }
    // Deprecated
    if (this.options.appCode) {
      params.app_code = this.options.appCode;
    }

    if (this.options.apiKey) {
      params.apiKey = this.options.apiKey;
    }
    if (this.options.language) {
      params.language = this.options.language;
    }
    if (this.options.politicalView) {
      params.politicalview = this.options.politicalView;
    }
    if (this.options.country) {
      params.country = this.options.country;
    }
    if (this.options.state) {
      params.state = this.options.state;
    }

    return params;
  }
}

Object.defineProperties(HereGeocoder.prototype, {
  // Here geocoding API endpoint
  _geocodeEndpoint: {
    get: function() {
      return 'https://geocoder.ls.hereapi.com/6.2/geocode.json';
    }
  },

  // Here reverse geocoding API endpoint
  _reverseEndpoint: {
    get: function() {
      return 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json';
    }
  }
});

module.exports = HereGeocoder;
