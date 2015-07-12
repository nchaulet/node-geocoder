(function() {

	/**
	* Helper object
	*/
    var Helper = {
        isString: function(testVar) {
            return typeof testVar === 'string' || testVar instanceof String;
        }
    };

    module.exports = Helper;

})();
