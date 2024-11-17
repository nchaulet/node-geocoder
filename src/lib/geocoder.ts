var BPromise = require('bluebird');

export class Geocoder {
  private _geocoder: any;
  private _formatter: any;

  /**
   * Constructor
   * @param {object} geocoder  Geocoder Adapter
   * @param {object} formatter Formatter adapter or null
   */
  constructor(geocoder: any, formatter?: any) {
    this._geocoder = geocoder;
    this._formatter = formatter;
  }

  /**
   * Batch geocode
   * @param <array>    values    array of Values to geocode (address or IP)
   * @param <function> callback
   *
   * @return promise
   */
  batchGeocode(values: any, callback?: any) {
    return BPromise.resolve()
      .then(() => {
        return BPromise.fromCallback((callback: any) => {
          this._geocoder.batchGeocode(values, callback);
        });
      })
      .asCallback(callback);
  }

  /**
   * Geocode a value (address or ip)
   * @param {string}   value    Value to geocoder (address or IP)
   * @param {function} [callback] Callback method
   */
  geocode(value: any, callback?: () => void) {
    return BPromise.resolve()
      .bind(this)
      .then(() => {
        return BPromise.fromCallback((callback: any) => {
          this._geocoder.geocode(value, callback);
        });
      })
      .then((data: any) => {
        return this._filter(value, data);
      })
      .then((data: any) => {
        return this._format(data);
      })
      .asCallback(callback);
  }

  /**
   * Reverse geocoding
   * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
   * @param {function} [callback] Callback method
   */
  reverse(query: { lat: number; lon: number }, callback?: any) {
    return BPromise.resolve()
      .then(() => {
        return BPromise.fromCallback((callback: any) => {
          this._geocoder.reverse(query, callback);
        });
      })
      .then((data: any) => {
        return this._format(data);
      })
      .asCallback(callback);
  }

  _filter = function (value: any, data: any) {
    if (!data || !data.length) {
      return data;
    }

    if (value.minConfidence) {
      data = data.filter(function (geocodedAddress: any) {
        if (geocodedAddress.extra && geocodedAddress.extra.confidence) {
          return geocodedAddress.extra.confidence >= value.minConfidence;
        }
      });
    }

    return data;
  };

  _format(data: any) {
    var _this = this;
    return BPromise.resolve()
      .bind(this)
      .then(function () {
        if (!data) {
          return data;
        }

        var _raw = data.raw;

        data = data.map(function (result: any) {
          result.provider = _this._geocoder.name;

          return result;
        });

        data.raw = _raw;
        Object.defineProperty(data, 'raw', {
          configurable: false,
          enumerable: false,
          writable: false
        });

        return data;
      })
      .then((data: any) => {
        var _data = data;
        if (this._formatter && this._formatter !== 'undefined') {
          _data = this._formatter.format(_data);
        }

        return _data;
      });
  }
}
