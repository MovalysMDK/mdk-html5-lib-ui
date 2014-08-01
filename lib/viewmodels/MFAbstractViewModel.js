'use strict';


angular.module('mfui').factory('MFAbstractViewModel', function() {
    var firstInstantiation = true;

    var MFAbstractViewModel = function MFAbstractViewModel() {
        if (firstInstantiation) {
            firstInstantiation = false;
        }
    };

    MFAbstractViewModel.prototype.isList = function () {
        return false;
    };

    var cloneBase = function(vm) {
        var newVM = new vm.constructor();
        var properties = Object.getOwnPropertyNames(vm);
        for (var i = 0, ii = properties.length; i < ii; ++i) {
            var srcDesc = Object.getOwnPropertyDescriptor(vm, properties[i]);
            var destDesc = Object.getOwnPropertyDescriptor(newVM, properties[i]);
            var srcVal = vm[properties[i]];
            // Tests if the source property is readable and the destination property is writable
            if (
                    (srcDesc.value !== undefined || srcDesc.get !== undefined) &&
                    (srcDesc.writable || destDesc.set !== undefined)
            ) {
                if (srcVal instanceof MFAbstractViewModel) {
                    // if it is a VM do a recursive call
                    newVM[properties[i]] = srcVal.clone();
                } else if (Array.isArray(srcVal)) {
                    // else copy the property value
                    newVM[properties[i]] = [];
                    for (var j = 0, jj = srcVal.length; j < jj; ++j) {
                        newVM[properties[i]][j] = srcVal[j] instanceof MFAbstractViewModel ? srcVal[j].clone() : srcVal[j];
                    }
                } else {
                    newVM[properties[i]] = srcVal;
                }
            }
        }
        return newVM;
    };

    MFAbstractViewModel.prototype.clone = function () {
        return cloneBase(this);
    };

    return MFAbstractViewModel;
});