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


angular.module('mfui').factory('MFComboVM', ['MFUtils', 'MFAbstractViewModel','MFIntegerConverter', function (MFUtils, MFAbstractViewModel,MFIntegerConverter) {

    var MFComboVM = function mfComboVM() {
        MFComboVM._Parent.call(this);

        var _itemsList = null;
        var isValueAttributeNumber = true;

        var _valueAttribute = null;
        var _selectedItem = null;
        var _selectedItemValue = null;


        Object.defineProperty(this, 'valueAttribute', {
            get: function () {
                return _valueAttribute;
            },
            set: function (value) {
                _valueAttribute = value;
            },
            enumerable: true,
            configurable: false
        });

        Object.defineProperty(this, 'selectedItem', {
            set: function (item) {
                if(!angular.isUndefinedOrNull(item)){
                    this.selectedItemValue = item[_valueAttribute];
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
        });

        Object.defineProperty(this, 'itemsList', {
            get: function () {
                return _itemsList;
            },
            set: function (value) {
                _itemsList = value;
                if(!angular.isUndefinedOrNull(value) &&  value.length > 0  && !angular.isUndefinedOrNull(value[0])){
                    isValueAttributeNumber = angular.isNumber(value[0][_valueAttribute]);
                }
            },
            enumerable: true,
            configurable: false
        });

        Object.defineProperty(this, 'selectedItemValue', {
            get: function () {
                return _selectedItemValue;
            },
            set: function (value) {
                if(isValueAttributeNumber  && !angular.isNumber(value)){
                    _selectedItemValue = MFIntegerConverter.fromString(value);
                }
                else {
                    _selectedItemValue = value;
                }

                _selectedItem=null;
                if(angular.isArray(_itemsList)){
                    for(var i=0;i<_itemsList.length;i++){
                        if(_itemsList[i][_valueAttribute] === _selectedItemValue){
                            _selectedItem = _itemsList[i];
                            break;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: false
        });



    };


    MFUtils.extend(MFComboVM, MFAbstractViewModel);

    MFComboVM.prototype.clone = function () {
        var newVM = new this.constructor();
        newVM.itemsList = this.itemsList;
        newVM.valueAttribute = this.valueAttribute;
        newVM.selectedItemValue  = this.selectedItemValue;

        return newVM;
    };

    return MFComboVM;
}]);
