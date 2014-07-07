'use strict';
/**
 * @file MFAddressLocationVM.js
 * @brief Photo model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFAddressLocationVM', ['MFUtils', 'MFAbstractViewModel', function (MFUtils, MFAbstractViewModel) {
    var MFAddressLocationVM = function MFAddressLocationVM() {
        MFAddressLocationVM._Parent.call(this);
        var _latitude;
        var _longitude;
        var _street;
        var _compl;
        var _city;
        var _country;

        Object.defineProperties(this, {
            latitude: {
                get: function() { return _latitude; },
                set: function(value) { _latitude = value; },
                enumerable: true,
                configurable: false
            },
            longitude: {
                get: function() { return _longitude; },
                set: function(value) { _longitude = value; },
                enumerable: true,
                configurable: false
            },
            street: {
                get: function() { return _street; },
                set: function(value) { _street = value; },
                enumerable: true,
                configurable: false
            },
            compl: {
                get: function() { return _compl; },
                set: function(value) { _compl = value; },
                enumerable: true,
                configurable: false
            },
            city: {
                get: function() { return _city; },
                set: function(value) { _city = value; },
                enumerable: true,
                configurable: false
            },
            country: {
                get: function() { return _country; },
                set: function(value) { _country = value; },
                enumerable: true,
                configurable: false
            }
        });
    };

    MFUtils.extend(MFAddressLocationVM, MFAbstractViewModel);

    return MFAddressLocationVM;
}]);
