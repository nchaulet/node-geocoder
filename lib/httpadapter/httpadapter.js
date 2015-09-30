var HttpError = require('../error/httperror.js');
var querystring = require('querystring');

var HttpAdapter = function(http) {

  if (!http || http === 'undefined') {
    http = require('http');
  }

  this.url = require('url');
  this.http = http;
};

/**
* X-RateLimit-* Headers
* @attribute limit     X-RateLimit-Limit     - the total number of transactions that your account is limited to over a 24 hour period
* @attribute remaining X-RateLimit-Remaining - the number of transactions remaining in the current 24 hour period
* @attribute reset     X-RateLimit-Reset     - the date and time, in UNIX format, at which your transaction count will reset
*/
HttpAdapter.prototype.rateLimit = {
  limit: null,
  remaining: null,
  reset: null
};

/**
* Geocode
* @param <string>   url      Webservice url
* @param <array>    params   array of query string parameters
* @param <function> callback Callback method
*/
HttpAdapter.prototype.get = function(url, params, callback) {

  var urlParsed = this.url.parse(url);
  var options = {
    host: urlParsed.host,
    path: urlParsed.path + '?' + querystring.stringify(params),
    headers: {
      'user-agent': 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0'
    }

  };

  this.http.request(options, function(response) {
    var str = '';
    var contentType = response.headers['content-type'];

    if (response.headers['X-RateLimit-Limit']) {
      this.rateLimit.limit = response.headers['X-RateLimit-Limit'];
    }
    if (response.headers['X-RateLimit-Remaining']) {
      this.rateLimit.remaining = response.headers['X-RateLimit-Remaining'];
    }
    if (response.headers['X-RateLimit-Reset']) {
      this.rateLimit.reset = response.headers['X-RateLimit-Reset'];
    }

    response.on('data', function(chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {

      if (response.statusCode !== 200) {
        return callback(new Error('Response status code is ' + response.statusCode), null);
      }

      if (contentType !== undefined && contentType.indexOf('application/json') >= 0) {
        callback(false, JSON.parse(str));
      } else {
        callback(false, str);
      }

    });
  }.bind(this))
  .on('error', function(err) {
    callback(new HttpError(err.message), null);
  })
  .end();
};

HttpAdapter.prototype.supportsHttps = function() {
  return false;
};

module.exports = HttpAdapter;
