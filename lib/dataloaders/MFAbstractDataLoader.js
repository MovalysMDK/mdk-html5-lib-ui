'use strict';

angular.module('mfui').factory('MFAbstractDataLoader', function() {

    var MFAbstractDataLoader = function MFAbstractDataLoader() {
        var _dataModel = null;
        var _dataModelId = null;
        var _loadOptions = null;
        Object.defineProperties(this, {
            dataModel: {
                get: function() { return _dataModel; },
                set: function(value) { _dataModel = value; },
                configurable: false,
                enumerable: true
            },
            dataModelId: {
                get: function() { return _dataModelId; },
                set: function(value) { _dataModelId = value; },
                configurable: false,
                enumerable: true
            },
            loadOptions : {
                get: function() { return _loadOptions; },
                set: function(value) { _loadOptions = value; },
                configurable: false,
                enumerable: true
            }
        });
    };

    return new MFAbstractDataLoader();
});

