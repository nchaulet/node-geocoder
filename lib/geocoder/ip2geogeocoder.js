var util             = require('util'),
    AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options     Options ({ apiKey: 'xxx' })
 */
var Ip2geoGeocoder = function Ip2geoGeocoder(httpAdapter, options) {
    this.supportIPv4   = true;
    this.supportIPv6   = true;
    this.supportAddress = false;

    Ip2geoGeocoder.super_.call(this, httpAdapter, options);

    if (!options || !options.apiKey || options.apiKey === 'undefined') {
        throw new Error(this.constructor.name + ' needs an apiKey');
    }

    // Inject X-Api-Key header into the http adapter for authentication
    if (httpAdapter.options) {
        httpAdapter.options.headers = Object.assign(
            {},
            httpAdapter.options.headers || {},
            { 'X-Api-Key': options.apiKey }
        );
    }
};

util.inherits(Ip2geoGeocoder, AbstractGeocoder);

// API endpoint
Ip2geoGeocoder.prototype._endpoint = 'https://api.ip2geo.dev/convert';

/**
 * Geocode
 * @param <string>   value    Value to geocode (IP address)
 * @param <function> callback Callback method
 */
Ip2geoGeocoder.prototype._geocode = function(value, callback) {
    var params = {
        ip: value
    };

    this.httpAdapter.get(this._endpoint, params, function(err, result) {
        if (err) {
            return callback(err);
        }

        if (!result || !result.success || !result.data) {
            return callback(new Error('ip2geo: Invalid response or request failed'));
        }

        var data = result.data;
        var results = [];

        var continent = data.continent || {};
        var country   = (continent && continent.country) || {};
        var city      = (country && country.city) || {};
        var subdiv    = (country && country.subdivision) || {};
        var timezone  = (city && city.timezone) || {};
        var currency  = (country && country.currency) || {};
        var flag      = (country && country.flag) || {};
        var asn       = data.asn || {};
        var regCountry = data.registered_country || {};

        results.push({
            'ip'                    : data.ip,
            'ipType'                : data.type,
            'isEu'                  : data.is_eu,
            'latitude'              : city.latitude,
            'longitude'             : city.longitude,
            'accuracyRadius'        : city.accuracy_radius,
            'geonameId'             : city.geoname_id,
            'metroCode'             : city.metro_code,
            'continent'             : continent.name,
            'continentCode'         : continent.code,
            'continentGeonameId'    : continent.geoname_id,
            'country'               : country.name,
            'countryCode'           : country.code,
            'countryGeonameId'      : country.geoname_id,
            'phoneCode'             : country.phone_code,
            'capital'               : country.capital,
            'tld'                   : country.tld,
            'flagEmoji'             : flag.emoji,
            'flagEmojiUnicode'      : flag.emoji_unicode,
            'flagImg'               : flag.img,
            'city'                  : city.name,
            'state'                 : subdiv.name,
            'stateCode'             : subdiv.code,
            'zipcode'               : city.postal_code,
            'timeZone'              : timezone.name,
            'timeNow'               : timezone.time_now,
            'currencyName'          : currency.name,
            'currencyCode'          : currency.code,
            'currencySymbol'        : currency.symbol,
            'asnNumber'             : asn.number,
            'asnName'               : asn.name,
            'registeredCountry'          : regCountry.name,
            'registeredCountryCode'      : regCountry.code,
            'registeredCountryGeonameId' : regCountry.geoname_id
        });

        results.raw = result;
        callback(false, results);
    });
};

module.exports = Ip2geoGeocoder;
