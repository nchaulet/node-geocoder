var util = require('util');
var AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options (language, clientId, apiKey)
 */
var TomTomGeocoder = function TomTomGeocoder(httpAdapter, options) {
  TomTomGeocoder.super_.call(this, httpAdapter, options);

  if (!this.options.apiKey || this.options.apiKey == 'undefined') {
    throw new Error('You must specify an apiKey');
  }
};

util.inherits(TomTomGeocoder, AbstractGeocoder);

// TomTom geocoding API endpoint
TomTomGeocoder.prototype._endpoint = 'https://api.tomtom.com/search/2/geocode';
TomTomGeocoder.prototype._batchGeocodingEndpoint =
  'https://api.tomtom.com/search/2/batch.json';

/**
 * Geocode
 * @param <string>   value    Value to geocode (Address)
 * @param <function> callback Callback method
 */
TomTomGeocoder.prototype._geocode = function (value, callback) {
  var _this = this;

  var params = {
    key: this.options.apiKey
  };

  if (this.options.language) {
    params.language = this.options.language;
  }

  if (this.options.country) {
    params.countrySet = this.options.country;
  }

  var url = this._endpoint + '/' + encodeURIComponent(value) + '.json';

  this.httpAdapter.get(url, params, function (err, result) {
    if (err) {
      return callback(err);
    } else {
      var results = [];

      for (var i = 0; i < result.results.length; i++) {
        results.push(_this._formatResult(result.results[i]));
      }

      results.raw = result;
      callback(false, results);
    }
  });
};

TomTomGeocoder.prototype._formatResult = function (result) {
  return {
    latitude: result.position.lat,
    longitude: result.position.lon,
    country: result.address.country,
    city: result.address.localName,
    state: result.address.countrySubdivision,
    zipcode: result.address.postcode,
    streetName: result.address.streetName,
    streetNumber: result.address.streetNumber,
    countryCode: result.address.countryCode
  };
};

/**
 * Batch Geocode
 * @param <string[]>   values    Valueas to geocode
 * @param <function> callback Callback method
 */
TomTomGeocoder.prototype._batchGeocode = async function (values, callback) {
  try {
    const jobLocation = await this.__createJob(values);
    const rawResults = await this.__pollJobStatusAndFetchResults(
      jobLocation,
      values
    );
    const parsedResults = this.__parseBatchResults(rawResults);
    callback(false, parsedResults);
  } catch (e) {
    callback(e, null);
  }
};

TomTomGeocoder.prototype.__createJob = async function (addresses) {
  const body = {
    batchItems: addresses.map(address => {
      let query = `/geocode/${encodeURIComponent(address)}.json`;
      const queryString = new URLSearchParams();
      if (this.options.country) {
        queryString.append('countrySet', this.options.country);
      }
      if (this.options.limit) {
        queryString.append('limit', this.options.limit);
      }
      if (queryString.toString()) {
        query += `?${queryString.toString()}`;
      }
      return { query };
    })
  };
  const params = {
    key: this.options.apiKey,
    waitTimeSeconds: 10
  };
  const options = {
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    },
    redirect: 'manual',
    body: JSON.stringify(body)
  };
  const response = await new Promise((resolve, reject) => {
    this.httpAdapter.post(
      this._batchGeocodingEndpoint,
      params,
      options,
      function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
  if (response.status !== 303) {
    const responseContentType = response.headers.get('Content-Type');
    if (
      responseContentType &&
      responseContentType.includes('application/json')
    ) {
      const errorBody = await response.json();
      throw new Error(errorBody.error.description);
    } else {
      throw new Error(await response.text());
    }
  }
  const location = response.headers.get('Location');
  if (!location) {
    throw new Error('Location header not found');
  }
  return location;
};

TomTomGeocoder.prototype.__pollJobStatusAndFetchResults = async function (
  location,
  addresses
) {
  let results;
  let stalledResponsesLeft = 84;
  for (; !results && stalledResponsesLeft > 0; stalledResponsesLeft -= 1) {
    let newLocation = location;
    const status = await new Promise((resolve, reject) => {
      this.httpAdapter.get(
        newLocation,
        {},
        function (err, res) {
          if (err) {
            return reject(err);
          }
          resolve(res);
        },
        true
      );
    });
    if (status.status === 200) {
      results = await status.json();
    } else if (status.status === 202) {
      newLocation = status.headers.get('Location');
      if (!newLocation) {
        throw new Error('Location header not found');
      }
    } else if (status.status === 429) {
      throw new Error('Provider error: Too many requests');
    } else {
      throw new Error(`Unexpected status: ${status.status}`);
    }
  }
  if (!results) {
    throw new Error('Long poll ended without results after 14 minutes');
  }
  if (!results.batchItems || results.batchItems.length !== addresses.length) {
    throw new Error('Batch items length mismatch');
  }
  return results;
};

TomTomGeocoder.prototype.__parseBatchResults = function (rawResults) {
  return rawResults.batchItems.map(result => {
    if (result.statusCode !== 200) {
      return {
        error: `statusCode: ${result.statusCode}`,
        value: []
      };
    }
    return {
      error: null,
      value: result.response.results.map((value) => ({
        ...this._formatResult(value),
        provider: 'tomtom'
      }))
    };
  });
};

module.exports = TomTomGeocoder;
