'use strict';

angular.module('mfui').factory('MFWorkspaceScopeBuilder', [
    '$injector',  '$q', '$state', '$stateParams', '$location', '$anchorScroll', 'MFDataViewScopeBuilder', 'MFGenericLoadDataAction', 'MFUpdateVMWithDataLoaderAction', 'MFActionLauncher', 'MFUtils',

    function($injector, $q, $state, $stateParams, $location, $anchorScroll,
             MFDataViewScopeBuilder, MFGenericLoadDataAction, MFUpdateVMWithDataLoaderAction, MFActionLauncher, MFUtils) {

        var MFWorkspaceScopeBuilder = function MFWorkspaceScopeBuilder() {};

        var MFWorkspaceScopeActions = function MFWorkspaceScopeActions($scope) {
            MFWorkspaceScopeActions._Parent.call(this, $scope);

            this.rootActions.registerWorkspaceScope($scope);
        };

        MFUtils.extend(MFWorkspaceScopeActions, MFDataViewScopeBuilder.actionsClass);

        MFWorkspaceScopeActions.prototype.initViewModel = function() {
            //each detail panel has its own vm factory
        };

        MFWorkspaceScopeActions.prototype.loadDetail = function(itemId, parentItemId, detailState) {
            var self = this;
            this.$scope.itemId = itemId === 'new' ? -1 : itemId;
            this.$scope.parentItemId = parentItemId === 'new' ? -1 : parentItemId;

            return this.$scope.actions.doFillAction().then(function() {
                $state.go(detailState, {itemId: itemId, parentItemId: parentItemId}).then(function() {
                    $location.hash('secondColumn');
                    $anchorScroll();
                });

                if (self.$scope.itemId === -1) {
                    self.rootActions.goInEditionMode();
                }
            });
        };

        MFWorkspaceScopeActions.prototype.isValid =function() {
            var valid = true;
            for(var detailColNumber=0;detailColNumber<this.$scope.rootActions.$scope.$formScopes.length; detailColNumber++) {
                valid = valid && this.$scope.rootActions.$scope.$formScopes[detailColNumber].actions.isValid();
            }
            return valid;
        };

        MFWorkspaceScopeActions.prototype.goOutEditionMode = function() {
            if (this.$scope.editMode) {
                // this.$scope.$screenScope.viewConfig.screenConfig
                this.$scope.editMode = false || this.$scope.$screenScope.viewConfig.screenConfig.disabledEditionMode;
            }
        };

        MFWorkspaceScopeActions.prototype.save = function() {
            var deferred = $q.defer();
            var self = this;
            if (!angular.isUndefinedOrNullOrEmpty(this.$scope.viewConfig.saveAction)) {

                self.submitted = true;

                if(self.isValid()){
                    var action = this.$scope.viewConfig.saveAction.createInstance();

                    MFActionLauncher.launchActions([{ action: action, params: {}}], true, false).then(function (context) {
                            self.goOutEditionMode();
                            self.rootActions.showInfoNotification('action.save.success');
                            self.rootActions.showNotifications(context.messages);

                            self.$scope.itemId = context.results[0];
                            $stateParams[self.$scope.actions.stateParamName] = self.$scope.itemId;

                            deferred.resolve(context);
                        }, function (context) {
                            self.rootActions.showErrorNotification('action.save.failure');
                            self.rootActions.showNotifications(context.messages);
                            deferred.reject(context);
                        }
                    );
                }
                else {
                    this.rootActions.showErrorNotification('form.error.invalid');
                    deferred.reject();
                }
            } else {
                this.rootActions.showErrorNotification('$scope.viewConfig.saveAction is not defined');
                deferred.reject();
            }

            return deferred.promise;
        };

        MFWorkspaceScopeActions.prototype.doFillAction = function() {
            var deferred = $q.defer();
            var self = this;

            try {

                console.log('MFWorkspaceScopeActions.doFillAction - itemId: ' + this.$scope.itemId);
                console.log('MFWorkspaceScopeActions.doFillAction - dataLoaderName: ', this.$scope.viewConfig.dataLoader);

                if (self.$scope.itemIdHasChanged) {

                    var loadDataAction = MFGenericLoadDataAction.createInstance();
                    loadDataAction.then(function(result) {
                        console.log('loadDataAction success', result);
                    }, function(error) {
                        console.log('loadDataAction failure', error);
                    });
                    var loadDataActionParams = {
                        dataLoader: self.$scope.viewConfig.dataLoader,
                        dataModelId: self.$scope.itemId,
                        dataModelParentId: self.$scope.parentItemId
                    };

                    MFActionLauncher.launchActions(
                            [{
                                action: loadDataAction,
                                params: loadDataActionParams
                            }],
                            true, false
                        ).then(
                        function(context) {
                            self.rootActions.showNotifications(context.messages);

                            var promises = [];
                            for (var detailScopeKey in self.$scope.rootActions.$scope.$formScopes) {
                                if (self.$scope.rootActions.$scope.$formScopes.hasOwnProperty(detailScopeKey)) {
                                    promises.push(self.$scope.rootActions.$scope.$formScopes[detailScopeKey].actions.doFillAction());
                                }
                            }

                            if (promises.length > 0) {
                                $q.all(promises).then(function() {
                                    deferred.resolve(context);
                                }, function() {
                                    deferred.reject(context);
                                });
                            } else {
                                deferred.resolve(context);
                            }

                        }, function(context) {
                            self.rootActions.showNotifications(context.messages);
                            deferred.reject();
                        }
                    );

                } else {
                    deferred.resolve();
                }

            } catch (error) {
                console.error(error);
                self.rootActions.showErrorNotification(error);
                deferred.reject();
            }

            return deferred.promise;
        };

        MFWorkspaceScopeActions.prototype.init = function(initListener) {

            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.screenConfig), '"$scope.viewConfig.screenConfig" is required in '+this.$scope.viewConfig.viewName);
            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.dataLoader), '"$scope.viewConfig.dataLoader" is required in '+this.$scope.viewConfig.viewName);

            this.$scope.viewConfig.isList = false;

            return MFWorkspaceScopeActions._super.init.call(this, initListener);
        };

        MFWorkspaceScopeActions.actionsClass = MFWorkspaceScopeActions;

        MFWorkspaceScopeBuilder.init = function($scope, initListener) {
            $scope.actions = new MFWorkspaceScopeActions($scope);

            return $scope.actions.init(initListener);
        };

        return MFWorkspaceScopeBuilder;
    }
]);