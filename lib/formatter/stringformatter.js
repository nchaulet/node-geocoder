var StringFormatter = function(pattern) {

    if (!pattern || pattern === 'undefinded') {
        throw new Error('StringFormatter need a pattern');
    }

    this.pattern = pattern;
};

StringFormatter.prototype.format = function(data) {
    
    var strings = [];

    for (var i = 0; i < data.length; i++) {
        var str = this.pattern
            .replace(/%n/, data[i].streetNumber)
            .replace(/%S/, data[i].streetName)
            .replace(/%z/, data[i].zipcode)
            .replace(/%P/, data[i].country)
            .replace(/%p/, data[i].countryCode)
            .replace(/%c/, data[i].city)
            .replace(/%T/, data[i].state)
            .replace(/%t/, data[i].stateCode);

        strings.push(str);
    }
    
    return strings;
};

module.exports = StringFormatter;
