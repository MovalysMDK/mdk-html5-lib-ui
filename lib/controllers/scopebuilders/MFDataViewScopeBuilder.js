'use strict';

angular.module('mfui').factory('MFDataViewScopeBuilder', [
    '$injector', '$stateParams', '$q',
    'MFViewScopeBuilder', 'MFGenericLoadDataAction', 'MFActionLauncher', 'MFUpdateVMWithDataLoaderAction', 'MFUtils', 'MFIntegerConverter',

    function($injector, $stateParams, $q,
             MFViewScopeBuilder, MFGenericLoadDataAction, MFActionLauncher, MFUpdateVMWithDataLoaderAction, MFUtils, MFIntegerConverter) {

        var MFDataViewScopeBuilder = function MFDataViewScopeBuilder() {};

        var MFDataViewScopeActions = function MFDataViewScopeActions($scope) {

            var _itemId = null;
            var _parentItemId = null;
            var _itemIdHasChanged = false;
            Object.defineProperty($scope, 'itemId', {
                get: function () {
                    return _itemId;
                },
                set: function (value) {
                    if( value !== _itemId ) {
                        this.itemIdHasChanged = true;
                    }
                    _itemId = value;
                },
                enumerable: true,
                configurable: false
            });
            Object.defineProperty($scope, 'parentItemId', {
                get: function () {
                    return _parentItemId;
                },
                set: function (value) {
                    _parentItemId = value;
                },
                enumerable: true,
                configurable: false
            });
            Object.defineProperty($scope, 'itemIdHasChanged', {
                get: function () {
                    return _itemIdHasChanged;
                },
                set: function (value) {
                    _itemIdHasChanged = value;
                },
                enumerable: true,
                configurable: false
            });

            MFDataViewScopeActions._Parent.call(this, $scope);
        };

        MFUtils.extend(MFDataViewScopeActions, MFViewScopeBuilder.actionsClass);

        MFDataViewScopeActions.prototype.initViewModel = function() {
            try {
                this.$scope.viewModel = this.$scope.viewConfig.viewModelFactory.createInstance();
            } catch (error) {
                console.error(error);
                this.rootActions.showErrorNotification(error);
                throw error;
            }
        };

        MFDataViewScopeActions.prototype.doFillAction = function() {
            var deferred = $q.defer();
            var self = this;
            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.viewModelFactory), '"$scope.viewConfig.viewModelFactory" is required in '+this.$scope.viewConfig.formName);

            try {

                console.log('MFDataViewScopeBuilder.doFillAction - itemId: ' + this.$scope.itemId);
                console.log('MFDataViewScopeBuilder.doFillAction - dataLoader: ', this.$scope.viewConfig.dataLoader);

                var loadDataAction = MFGenericLoadDataAction.createInstance();
                loadDataAction.then(function(result) {
                    console.info('[MFDataViewScopeBuilder] BDD => Model (done)', result.result);
                }, function(error) {
                    console.log('loadDataAction failure', error);
                });

                var loadDataActionParams = {
                    dataLoader: this.$scope.viewConfig.dataLoader,
                    dataModelId: this.$scope.itemId,
                    dataModelParentId: this.$scope.parentItemId,
                    entitiesToReload: this.$scope.viewConfig.entitiesToReload
                };

                var updateVmAction = MFUpdateVMWithDataLoaderAction.createInstance();
                updateVmAction.then(function(result) {
                    console.info('[MFDataViewScopeBuilder] Model => ViewModel (done)', result.result);
                }, function(error) {
                    console.log('updateVM failure', error);
                });

                var updateVmInputParams = {
                    dataLoader: this.$scope.viewConfig.dataLoader,
                    viewModelFactory: this.$scope.viewConfig.viewModelFactory,
                    viewModel: this.$scope.viewModel,
                    entitiesToReload: this.$scope.viewConfig.entitiesToReload

                };

                MFActionLauncher.launchActions(
                        [{
                            action: loadDataAction,
                            params: loadDataActionParams
                        }, {
                            action: updateVmAction,
                            params: updateVmInputParams
                        }],
                        true, false).then(function(context) {
                        self.rootActions.showNotifications(context.messages);
                        deferred.resolve(context);
                    }, function(context) {
                        self.rootActions.showNotifications(context.messages);
                        deferred.reject();
                    });
            } catch (error) {
                console.error(error);
                self.rootActions.showErrorNotification(error);
                deferred.reject();
            }
            return deferred.promise;
        };

        MFDataViewScopeActions.prototype.init = function(initListener) {
            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.viewName), '"$scope.viewConfig.viewName" is required in '+this.$scope.viewConfig.formName);
            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.isList), '"$scope.viewConfig.isList" is required in '+this.$scope.viewConfig.viewName);


            if(!angular.isUndefinedOrNullOrEmpty($stateParams)){

                if (angular.isUndefined($stateParams.itemId)) {

                    var sectionKey = null;
                    for( var prop in $stateParams ) {
                        if( $stateParams[ prop ] === this.$scope.viewConfig.viewName ) {
                            sectionKey = prop;
                            break;
                        }
                    }
                    if (sectionKey !== null) {
                        this.$scope.actions.stateParamName = sectionKey + 'Id';
                    }
                    else {
                        this.$scope.actions.stateParamName = null;
                    }
                } else {
                    this.$scope.actions.stateParamName = 'itemId';
                }

                if(!angular.isUndefinedOrNullOrEmpty(this.$scope.actions.stateParamName)){
                    this.$scope.itemId = $stateParams[this.$scope.actions.stateParamName];
                }

                if(!angular.isUndefinedOrNullOrEmpty($stateParams.parentItemId)) {
                    this.$scope.parentItemId = Number($stateParams.parentItemId);
                }

                if ( angular.isDefined(this.$scope.itemId) && (this.$scope.itemId === null || this.$scope.itemId.length === 0 || this.$scope.itemId === '-1' || /^(new)/.test(this.$scope.itemId)) ) {
                    this.$scope.itemId = 'new';
                } else {
                    this.$scope.itemId = MFIntegerConverter.fromString( this.$scope.itemId);
                }

                this.$scope.itemIdHasChanged = false;

            }

            var deferred = $q.defer();
            var self = this;
            self.initViewModel();
            MFDataViewScopeActions._super.init.call(this, initListener).then(function() {
                    self.doFillAction().then(
                        function() {
                            deferred.resolve();
                        },
                        function(error) {
                            deferred.reject(error);
                        }
                    );
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };


        MFDataViewScopeBuilder.actionsClass = MFDataViewScopeActions;

        MFDataViewScopeBuilder.init = function($scope, initListener) {
            $scope.actions = new MFDataViewScopeActions($scope);
            return $scope.actions.init(initListener);
        }

        MFDataViewScopeBuilder.reload = function($scope, entitiesToReload) {
            $scope.viewConfig.entitiesToReload = entitiesToReload;
            return $scope.actions.doFillAction();
        };

        return MFDataViewScopeBuilder;
    }
]);