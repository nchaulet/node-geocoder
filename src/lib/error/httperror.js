var util = require('util');

var HttpError = function(message, options) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = 'HttpError';
    this.message = message;

    options = options || {};

    for(var k in options) {
      this[k] = this[k] || options[k];
    }
};

util.inherits(HttpError, Error);

module.exports = HttpError;
