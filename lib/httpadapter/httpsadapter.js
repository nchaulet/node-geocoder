var HttpAdapter = require('./httpadapter.js');
var util = require('util');

var HttpsAdapter = function(http) {

    if (!http || http === 'undefined') {
        http = require('https');
    }

    this.url = require('url');
    this.http = http;
};

HttpAdapter.prototype.supportsHttps = function() {
    return true;
};

util.inherits(HttpsAdapter, HttpAdapter);

module.exports = HttpsAdapter;
