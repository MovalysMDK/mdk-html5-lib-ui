'use strict';
/**
 * @file MFPhotoVM.js
 * @brief Photo model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFPhotoVM', ['MFUtils', 'MFAbstractViewModel', function (MFUtils, MFAbstractViewModel) {
    var MFPhotoVM = function MFPhotoVM() {
        MFPhotoVM._Parent.call(this);

        var _name;
        var _uri;
        var _date;
        var _desc;
        var _photoState;
        var _photoLocation;

        Object.defineProperties(this, {
            name: {
                get: function() { return _name; },
                set: function(value) { _name = value; },
                enumerable: true,
                configurable: false
            },
            uri: {
                get: function() { return _uri; },
                set: function(value) { _uri = value; },
                enumerable: true,
                configurable: false
            },
            date: {
                get: function() { return _date; },
                set: function(value) { _date = value; },
                enumerable: true,
                configurable: false
            },
            desc: {
                get: function() { return _desc; },
                set: function(value) { _desc = value; },
                enumerable: true,
                configurable: false
            },
            photoState: {
                get: function() { return _photoState; },
                set: function(value) { _photoState = value; },
                enumerable: true,
                configurable: false
            },
            photoLocation: {
                get: function() { return _photoLocation; },
                set: function(value) { _photoLocation = value; },
                enumerable: true,
                configurable: false
            }
        });
    };




    MFUtils.extend(MFPhotoVM, MFAbstractViewModel);

    MFPhotoVM.prototype.clone = function () {
        var newVM = new this.constructor();
        newVM.name = this.name;
        newVM.date = this.date;
        newVM.uri = this.uri;
        newVM.desc  = this.desc;
        newVM.photoState  = this.photoState;
        newVM.photoLocation  = this.photoLocation.clone();

        return newVM;
    };


    return MFPhotoVM;
}]);
