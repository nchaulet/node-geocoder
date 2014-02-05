(function() {

    var HttpAdapter = function(http) {

        if (!http || http === 'undefined') {
            http = require('http');
        }

        this.url = require('url');
        this.http = http;
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
            path: urlParsed.path + this.url.format({query: params})

        };

        this.http.request(options, function(response) {
            var str = '';
            var contentType = response.headers['content-type'];
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {

                if (response.statusCode != 200) {
                    return callback(new Error('Response status code is ' + response.statusCode), null);
                }

                if (contentType.indexOf('application/json') >= 0) {
                    callback(false, JSON.parse(str));
                } else {
                    callback(false, str);
                }

            });
        }).end();
    };

    module.exports = HttpAdapter;

})();
