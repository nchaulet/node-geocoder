const readline = require('readline');
const AbstractGeocoder = require('./abstractgeocoder');
const ValueError = require('./../error/valueerror');

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

    this.httpAdapter.get(this._geocodeEndpoint, params, function (err, result) {
      var results = [];
      results.raw = result;

      if (err) {
        return callback(err, results);
      } else {
        if (result.type === 'ApplicationError') {
          return callback(new ValueError(result.Details), results);
        }
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

    this.httpAdapter.get(this._reverseEndpoint, params, function (err, result) {
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
    if (this.options.limit) {
      params.limit = this.options.limit;
    }

    return params;
  }

  async _batchGeocode(values, callback) {
    try {
      const jobId = await this.__createJob(values);
      await this.__pollJobStatus(jobId);
      const rawResults = await this._getJobResults(jobId);
      const results = this.__parseBatchResults(rawResults);
      callback(false, results);
    } catch (error) {
      callback(error, null);
    }
  }

  async __createJob(values) {
    const { country } = this.options;
    const body =
      `recId|searchText${country ? '|country' : ''}` +
      '\n' +
      values
        .map(
          (value, ix) => `${ix + 1}|"${value}"${country ? `|${country}` : ''}`
        )
        .join(' \n') +
      '\n';
    const params = {
      ...this._prepareQueryString(),
      action: 'run',
      outdelim: '|',
      indelim: '|',
      header: false,
      outputcombined: true,
      outcols:
        'latitude,longitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,addressDetailsCountry,country,building,locationId'
    };
    const options = {
      body,
      headers: {
        'content-type': 'text/plain',
        accept: 'application/json'
      }
    };
    const creteJobReq = await new Promise((resolve, reject) => {
      this.httpAdapter.post(
        this._batchGeocodeEndpoint,
        params,
        options,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
    const jobRes = await creteJobReq.json();
    if (jobRes.type === 'ApplicationError') {
      throw new Error(jobRes.Details);
    }
    return jobRes.Response.MetaInfo.RequestId;
  }

  async __pollJobStatus(jobId) {
    let completed = false;
    let stalledResultsCount = 500;
    const url = `${this._batchGeocodeEndpoint}/${jobId}`;
    const params = {
      ...this._prepareQueryString(),
      action: 'status'
    };
    for (; !completed && stalledResultsCount > 0; stalledResultsCount--) {
      const jobStatus = await new Promise((resolve, reject) => {
        this.httpAdapter.get(url, params, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
      if (jobStatus.Response.Status === 'completed') {
        completed = true;
        break;
      }
    }
    if (!completed) {
      throw new Error('Job timeout');
    }
  }

  async _getJobResults(jobId) {
    // fetch job results
    const params = {
      ...this._prepareQueryString(),
      outputcompressed: false
    };
    const jobResult = await new Promise((resolve, reject) => {
      this.httpAdapter.get(
        `${this._batchGeocodeEndpoint}/${jobId}/result`,
        params,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
        true
      );
    });
    const jobResultLineReadeer = readline.createInterface({
      input: jobResult.body,
      crlfDelay: Infinity
    });
    const res = [];
    for await (const line of jobResultLineReadeer) {
      const [
        recId,
        ,
        ,
        /*seqNumber*/ /*seqLength*/ latitude,
        longitude,
        locationLabel,
        houseNumber,
        street,
        district,
        city,
        postalCode,
        county,
        state,
        addressDetailsCountry,
        country,
        building,
        locationId
      ] = line.split('|');
      const index = Number(recId) - 1; // minus one because our index starts at 0 and theirs at 1
      res[index] = res[index] || { error: null, values: [] };
      res[index].values.push({
        latitude: Number(latitude),
        longitude: Number(longitude),
        houseNumber,
        street,
        locationLabel,
        district,
        city,
        postalCode,
        county,
        state,
        addressDetailsCountry, // country name. See formatting
        country, // contry code. See formatting
        building,
        locationId
      });
    }

    // fetch job erros sepparately
    const jobErrors = await new Promise((resolve, reject) => {
      this.httpAdapter.get(
        `${this._batchGeocodeEndpoint}/${jobId}/errors`,
        params,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
        true
      );
    });
    const jobErrorsLineReader = readline.createInterface({
      input: jobErrors.body,
      crlfDelay: Infinity
    });
    for await (const line of jobErrorsLineReader) {
      const matches = line.match(/Line Number:(?<index>\d+)\s+(?<line>.*)/);
      if (matches && matches.groups && matches.index) {
        const index = Number(matches.groups.index) - 2; // minus one because the first line is the header & one less because our index starts at 0 while theirs at 1
        res[index] = res[index] || { error: null, values: [] };
        res[index].error = matches.groups.line;
      } else {
        throw new Error(`Unexpected error line format: "${line}"`);
      }
    }
    return res;
  }

  __parseBatchResults(results) {
    return results.map(result => {
      const { values, error } = result;
      return {
        error,
        value: values.map(value => {
          const {
            latitude,
            longitude,
            district,
            city,
            county,
            state,
            addressDetailsCountry,
            country,
            building
          } = value;
          return {
            formattedAddress: value.locationLabel,
            latitude,
            longitude,
            country: addressDetailsCountry,
            countryCode: country,
            state,
            county,
            city,
            zipcode: value.postalCode,
            district,
            streetName: value.street,
            streetNumber: value.houseNumber,
            building,
            extra: {
              herePlaceId: value.locationId,
              confidence: null
            },
            provider: 'here'
          };
        })
      };
    });
  }
}

Object.defineProperties(HereGeocoder.prototype, {
  // Here geocoding API endpoint
  _geocodeEndpoint: {
    get: function () {
      return 'https://geocoder.ls.hereapi.com/6.2/geocode.json';
    }
  },

  // Here reverse geocoding API endpoint
  _reverseEndpoint: {
    get: function () {
      return 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json';
    }
  },

  // Here batch geocoding API endpoint
  _batchGeocodeEndpoint: {
    get: function () {
      return 'https://batch.geocoder.ls.hereapi.com/6.2/jobs';
    }
  }
});

module.exports = HereGeocoder;
