'use strict';


angular.module('mfui').factory('MFComboVM', ['MFUtils', 'MFAbstractViewModel','MFIntegerConverter', function (MFUtils, MFAbstractViewModel,MFIntegerConverter) {

    function MFComboVM() {
        MFComboVM._Parent.call(this);

        var _itemsList = null;
        var isValueAttributeNumber = true;

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


        var _selectedItemValue = null;

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


        var _valueAttribute = null;

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


        var _selectedItem = null;

        Object.defineProperty(this, 'selectedItem', {
            set: function (item) {
                _selectedItemValue = item[_valueAttribute];
                _selectedItem = item;
            },
            get: function () {
                return _selectedItem;
            },
            enumerable: true,
            configurable: false
        });

    }

    var cloneBase = function(vm) {
        var newVM = new vm.constructor();
        newVM.itemsList = vm.newVM;
        newVM.valueAttribute = vm.valueAttribute;
        return newVM;
    };

    MFUtils.extend(MFComboVM, MFAbstractViewModel);

    MFComboVM.prototype.clone = function () {
        return cloneBase(this);
    };

    return MFComboVM;
}]);
