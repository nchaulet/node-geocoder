var util = require('util');

var HttpError = function(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = 'HttpError';
    this.message = message;
};

util.inherits(HttpError, Error);

module.exports = HttpError;
