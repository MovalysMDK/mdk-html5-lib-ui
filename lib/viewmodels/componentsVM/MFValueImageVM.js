'use strict';
/**
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFValueImageVM', ['MFUtils', 'MFAbstractViewModel',function (MFUtils, MFAbstractViewModel) {
    var MFValueImageVM = function MFValueImageVM() {
        MFValueImageVM._Parent.call(this);
        var _selectedItem = null;
        var _pictureDir = null;
        var _valueAttribute = null;
        var _pictureType = null;

        Object.defineProperties(this, {
            selectedItem: {
                set: function (item) {
                    _selectedItem = item;
                },
                get: function () {
                    return _selectedItem;
                },
                enumerable: true,
                configurable: false
            },
            valueAttribute: {
                set: function (item) {
                    _valueAttribute = item;
                },
                get: function () {
                    return _valueAttribute;
                },
                enumerable: true,
                configurable: false
            },
            pictureType: {
                set: function (item) {
                    _pictureType = item;
                },
                get: function () {
                    return _pictureType;
                },
                enumerable: true,
                configurable: false
            },
            pictureDir: {
                set: function (item) {
                    _pictureDir = item;
                },
                get: function () {
                    return _pictureDir;
                },
                enumerable: true,
                configurable: false
            },
            pictureName: {
                get: function () {
                    if(angular.isUndefinedOrNullOrEmpty(_valueAttribute)){
                        return _selectedItem;
                    }
                    else {
                        return _selectedItem[_valueAttribute];
                    }
                },
                enumerable: true,
                configurable: false
            },
            pictureURI: {
                get: function () {
                    return _pictureDir+'/'+this.pictureName+'.'+_pictureType.key;
                },
                enumerable: true,
                configurable: false
            }
        });




    };

    MFUtils.extend(MFValueImageVM, MFAbstractViewModel);

    MFValueImageVM.prototype.clone = function () {
        var newVM = new this.constructor();
        newVM.selectedItem = this.selectedItem;
        newVM.valueAttribute = this.valueAttribute;
        newVM.pictureType = this.pictureType;
        newVM.pictureDir = this.pictureDir;

        return newVM;
    };

    return MFValueImageVM;
}]);
