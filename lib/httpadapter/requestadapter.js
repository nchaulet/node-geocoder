'use strict';

var HttpError = require('../error/httperror.js');
var request = require('request-promise');

/**
* RequestAdapter
* @param <object>   http      an optional http instance to use
* @param <object>   options   additional options to set on the request
*/
var RequestAdapter = function(request, options) {
  this.options = options;
};

RequestAdapter.prototype.supportsHttps = function() {
  return true;
};

/**
* get
* @param <string>   uri      Webservice url
* @param <array>    params   array of query string parameters
* @param <function> callback Callback method
*/
RequestAdapter.prototype.get = function(url, params, callback) {
  var options = {
    uri: url,
    qs: params,
    headers: {
      'user-agent': 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0'
    },
    resolveWithFullResponse: true,
    json: true
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

  return request(options).then(function handleResponse(response) {
    return response.body;
  })
  .catch(function(error) {
    var _error = error.cause ? error.cause : error;
    throw new HttpError(_error.message, {
      code: _error.code
    });
  })
  .asCallback(callback);
};

module.exports = RequestAdapter;
