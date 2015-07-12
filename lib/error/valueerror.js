var util = require('util');

var ValueError = function(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = 'ValueError';
    this.message = message;
};

util.inherits(ValueError, Error);

module.exports = ValueError;
