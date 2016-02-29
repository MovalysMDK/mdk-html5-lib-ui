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

    MFAddressLocationVM.prototype.clone = function () {
        var newVM = new this.constructor();
        newVM.latitude = this.latitude;
        newVM.longitude = this.longitude;
        newVM.street = this.street;
        newVM.compl = this.compl;
        newVM.city = this.city;
        newVM.country = this.country;
        return newVM;
    };

    return MFAddressLocationVM;
}]);
