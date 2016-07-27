var HttpAdapter = require('./httpadapter.js');
var util = require('util');

/**
* HttpsAdapter
* @param <object>   http      an optional http instance to use
* @param <object>   options   additional options to set on the request
*/
var HttpsAdapter = function(http,options) {
  if (!http || http === 'undefined') {
    http = require('https');
  }

  this.url = require('url');
  this.http = http;
  this.options = options;
};

HttpAdapter.prototype.supportsHttps = function() {
  return true;
};

util.inherits(HttpsAdapter, HttpAdapter);

module.exports = HttpsAdapter;
