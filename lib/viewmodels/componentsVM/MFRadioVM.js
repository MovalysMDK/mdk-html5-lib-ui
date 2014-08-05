'use strict';
/**
 * @file MFPhotoVM.js
 * @brief Radio model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

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
