'use strict';

angular.module('mfui').factory('MFComboVMFactory', ['MFUtils', 'MFComboVM', function (MFUtils, MFComboVM) {

    var MFComboVMFactory = function MFComboVMFactory() {
    };

    MFComboVMFactory.prototype.createInstance = function(valueAttribute) {
        console.assert(!angular.isUndefinedOrNullOrEmpty(valueAttribute),'the parameter "valueAttribute" is mandatory');
        var newInstance = new MFComboVM();
        newInstance.itemsList = [];
        newInstance.selectedItemValue = '';
        newInstance.valueAttribute = valueAttribute;

        return newInstance;
    };

    return new MFComboVMFactory();

}]);