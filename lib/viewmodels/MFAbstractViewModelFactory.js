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

