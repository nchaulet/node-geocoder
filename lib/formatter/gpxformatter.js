(function() {

    var GpxFormatter = function() {

    };

    GpxFormatter.prototype.format = function(data) {
        var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
        gpx += '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        gpx += ' xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"';
        gpx += ' creator="geocoder.js">';

        for (var i = 0; i < data.length; i++) {
            gpx += '<wpt lat="' + data[i].latitude+ '" lon="' + data[i].longitude + '">';
            gpx += '<name></name>';
            gpx += '</wpt>';
        }
  
        gpx += '</gpx>';

        return gpx;
    };

    module.exports = GpxFormatter;

}());