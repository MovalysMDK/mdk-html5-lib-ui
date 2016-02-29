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

angular.module('mfui').factory('MFAbstractViewModelFactory',['MFException',  function(MFException) {

    var MFAbstractViewModelFactory = function MFAbstractViewModelFactory() {


        var _singletonVM = null;

        Object.defineProperty(this, 'singletonVM', {
            get: function () {
                return _singletonVM;
            },
            set: function (value) {
                _singletonVM = value;
            },
            enumerable: true,
            configurable: false
        });

        /**
         * boolean saying the behavior of getInstance()
          */
        Object.defineProperty(this, 'keepInstance', {
            value: null,
            writable: true,
            enumerable: true,
            configurable: false
        });
    };

    MFAbstractViewModelFactory.prototype.getInstance = function() {
        var result = null;

        console.assert(!angular.isUndefinedOrNull(this.keepInstance),'this.keepInstance is required');

        if ( this.keepInstance ) {
            if ( !this.singletonVM ) {
                console.log('vmFactory: init singleton');
                this.singletonVM = this.createInstance();
            }
            console.log('vmFactory: return singleton');
            result = this.singletonVM ;
        }
        else {
            console.log('vmFactory: new Instance');
            result = this.createInstance();
        }
        return result;
    };

    MFAbstractViewModelFactory.prototype.createInstance = function() {
        throw new MFException('should be implemented');
    };

    MFAbstractViewModelFactory.prototype.setViewModelListWithEntities = function (viewModelList, entities, itemVmFactory) {
        console.log('setListViewModelWithEntities');
        console.log('entities: ', entities);
        viewModelList.clear();
        if ( !angular.isUndefinedOrNull(entities) ) {
            for (var i = 0; i < entities.length; i++) {
                var itemVm = itemVmFactory.createInstance();
                itemVmFactory.updateViewModelWithEntity(itemVm, entities[i]);
                viewModelList.push(itemVm);
            }
        }
        console.log('setListViewModelWithEntities after: ', viewModelList.length);
    };

    MFAbstractViewModelFactory.prototype.setEntitiesWithViewModelList = function (entities, viewModelList, entityFactory,
                                                                                  itemVmFactory, cache) {

        if (viewModelList !== null) {
            var mapEntities = {};
            var i;

            for ( i = 0; i < entities.length; i++) {
                mapEntities[entities[i].idToString] = entities[i];
            }
            entities.clear();

            for ( i = 0; i < viewModelList.length; i++) {
                var itemVm = viewModelList[i];
                var ent = mapEntities[itemVm.idToString];
                if ( angular.isUndefinedOrNull(ent)) {
                    ent = entityFactory.createInstance();
                }

                itemVmFactory.updateEntityWithViewModel(ent, itemVm, cache);

                entities.push(ent);
            }
        }
    };

    return new MFAbstractViewModelFactory();
}]);

