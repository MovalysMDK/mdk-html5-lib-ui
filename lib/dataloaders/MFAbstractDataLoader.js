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

angular.module('mfui').factory('MFAbstractDataLoader', function() {

    var MFAbstractDataLoader = function MFAbstractDataLoader() {
        var _dataModel = null;
        var _dataModelId = null;
        var _loadOptions = null;
        Object.defineProperties(this, {
            dataModel: {
                get: function() { return _dataModel; },
                set: function(value) { _dataModel = value; },
                configurable: false,
                enumerable: true
            },
            dataModelId: {
                get: function() { return _dataModelId; },
                set: function(value) { _dataModelId = value; },
                configurable: false,
                enumerable: true
            },
            loadOptions : {
                get: function() { return _loadOptions; },
                set: function(value) { _loadOptions = value; },
                configurable: false,
                enumerable: true
            }
        });
    };

    return new MFAbstractDataLoader();
});

