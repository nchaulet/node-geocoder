'use strict';
(function () {

    var RequestifyAdapter = function(requestify) {

        if (!requestify || requestify === 'undefinded') {
            this.requestify = require('requestify');
        } else {
            this.requestify = requestify;
        }
    };

    RequestifyAdapter.prototype.get = function(url, params, callback) {
        this.requestify.get(url, {
            'params' : params
        }).then(function(response) {
            callback(false, response.getBody());
        });
    };

    module.exports = RequestifyAdapter;

})();