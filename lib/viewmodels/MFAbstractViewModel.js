/**
 * Copyright (C) 2016 Sopra Steria Group (movalys.support@soprasteria.com)
 *
 * This file is part of Movalys MDK.
 * Movalys MDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * Movalys MDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with Movalys MDK. If not, see <http://www.gnu.org/licenses/>.
 */
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

    MFAbstractViewModel.prototype.clone = function () {
        var vm = this;
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

    return MFAbstractViewModel;
});