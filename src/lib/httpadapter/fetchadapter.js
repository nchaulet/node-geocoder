'use strict';

const HttpError = require('../error/httperror.js');
const nodeFetch = require('node-fetch');
const BPromise = require('bluebird');

class FetchAdapter {
  constructor(options = {}) {
    this.fetch = options.fetch || nodeFetch;
    this.options = { ...options };
    delete this.options.fetch;
  }

  supportsHttps() {
    return true;
  }

  get(url, params, callback, fullResponse = false) {
    var options = {
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
        'accept': 'application/json;q=0.9, */*;q=0.1'
      }
    };

    if (this.options) {
      for (var k in this.options) {
        var v = this.options[k];
        if (!v) {
          continue;
        }
        options[k] = v;
      }
    }
    return BPromise.resolve()
      .then(async () => {
        const queryString = new URLSearchParams(params);
        if (queryString.toString()) {
          url += `?${queryString.toString()}`;
        }
        const res = await this.fetch(url, options);
        if (fullResponse) {
          return res;
        }
        const rawResponseBody = await res.text();
        try {
          return JSON.parse(rawResponseBody);
        } catch (e) {
          throw new HttpError(rawResponseBody, {
            code: res.statusCode
          });
        }
      })
      .catch(function (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        const _error = error.cause ? error.cause : error;
        throw new HttpError(_error.message, {
          code: _error.code
        });
      })
      .asCallback(callback);
  }

  post(url, params, options, callback) {
    options.method = 'POST';
    options.headers = options.headers || {};
    options.headers['user-agent'] = 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0';
    if (this.options) {
      for (var k in this.options) {
        var v = this.options[k];
        if (!v) {
          continue;
        }
        options[k] = v;
      }
    }
    return BPromise.resolve()
      .then(async () => {
        const queryString = new URLSearchParams(params);
        if (queryString.toString()) {
          url += `?${queryString.toString()}`;
        }
        return await this.fetch(
          url,
          options
        );
      })
      .catch(function(error) {
        if (error instanceof HttpError) {
          throw error;
        }
        const _error = error.cause ? error.cause : error;
        throw new HttpError(_error.message, {
          code: _error.code
        });
      })
      .asCallback(callback);
  }
}

module.exports = FetchAdapter;
