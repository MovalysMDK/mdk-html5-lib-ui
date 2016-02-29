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

angular.module('mfui').factory('MFRadioVM', ['MFUtils', 'MFAbstractViewModel','MFIntegerConverter', function (MFUtils, MFAbstractViewModel,MFIntegerConverter) {
    var MFRadioVM = function MFRadioVM() {
        MFRadioVM._Parent.call(this);
        var _itemsList;
        var _selectedItemValue;
        var _valueAttribute = null;
        var _selectedItem = null;
        var isValueAttributeNumber = true;

        Object.defineProperties(this, {
            itemsList: {
                get: function() { return _itemsList; },
                set: function(value) {
                    _itemsList = value;
                    if(value.length > 0 && !angular.isUndefinedOrNull(value[0])){
                        isValueAttributeNumber = angular.isNumber(value[0][_valueAttribute]);
                    }
                },
                enumerable: true,
                configurable: false
            },
            selectedItemValue: {
                get: function() {
                    return _selectedItemValue;
                },
                set: function(value) {
                    if(isValueAttributeNumber && !angular.isNumber(value)){
                        _selectedItemValue = MFIntegerConverter.fromString(value);
                    }
                    else {
                        _selectedItemValue = value;
                    }
                    _selectedItem = null;
                    for(var i=0;i<_itemsList.length;i++){
                        if(_itemsList[i][_valueAttribute] === _selectedItemValue){
                            _selectedItem = _itemsList[i];
                        }
                    }
                },
                enumerable: true,
                configurable: false
            },
            selectedItem: {
                set: function (enumItem) {
                    if(!angular.isUndefinedOrNull(enumItem)){
                        this.selectedItemValue = enumItem[_valueAttribute];
                    }
                    else {
                        this.selectedItemValue = null;
                    }
                },
                get: function () {
                    return _selectedItem;
                },
                enumerable: true,
                configurable: false
            },
            valueAttribute: {
                get: function () {
                    return _valueAttribute;
                },
                set: function (value) {
                    _valueAttribute = value;
                },
                enumerable: true,
                configurable: false
            }
        });




    };

    MFUtils.extend(MFRadioVM, MFAbstractViewModel);

    MFRadioVM.prototype.clone = function () {
        var newVM = new this.constructor();
        newVM.itemsList = this.itemsList;
        newVM.valueAttribute = this.valueAttribute;
        newVM.selectedItemValue  = this.selectedItemValue;

        return newVM;
    };


    return MFRadioVM;
}]);
