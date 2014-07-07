'use strict';


/**
 * A service that returns some data.
 */
angular.module('mfui').factory('MFControllerConfig', function() {

    var config = {
        errors : {
            dao : 'DAO Error'
        }
    };

    return config;
});
