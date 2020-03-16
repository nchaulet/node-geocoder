'use strict';

const HttpError = require('../error/httperror.js');
const nodeFetch = require('node-fetch');
const querystring = require('querystring');
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

  get(url, params, callback) {
    var options = {
      headers: {
        'user-agent':
          'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0'
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
        const res = await this.fetch(
          url + '?' + querystring.encode(params),
          options
        );

        return res.json();
      })
      .catch(function(error) {
        var _error = error.cause ? error.cause : error;
        throw new HttpError(_error.message, {
          code: _error.code
        });
      })
      .asCallback(callback);
  }
}

module.exports = FetchAdapter;
