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
