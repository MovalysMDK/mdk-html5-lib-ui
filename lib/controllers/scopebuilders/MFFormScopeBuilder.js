'use strict';

angular.module('mfui').factory('MFFormScopeBuilder',
        ['$injector',  '$modal', '$q',
         'MFDataViewScopeBuilder', 'MFFormModals', 'MFControllerConfig', 'MFUtils', 'MFActionLauncher','$state', '$stateParams','MFActionOnScroll',

         function ($injector, $modal, $q,
                 MFDataViewScopeBuilder, MFFormModals, MFControllerConfig, MFUtils, MFActionLauncher, $state, $stateParams,MFActionOnScroll) {

            var MFFormScopeActions = function MFFormScopeActions($scope) {
                var self = this;

                MFFormScopeActions._Parent.call(self, $scope);

                Object.defineProperty(this, 'form', {
                    get: function() {
                        return self.$scope[self.$scope.viewConfig.formName];
                    }
                });
                Object.defineProperty(this, 'submitted', {
                    value: false,
                    writable:true,
                    enumerable: true,
                    configurable:false
                });
                // $scope.$screenScope.viewConfig.screenConfig
                $scope.editMode = false || $scope.$screenScope.viewConfig.screenConfig.disabledModeNonEditable;
                this.viewModelBackup = null;
                this.rootActions.registerFormScope($scope);
            };

            MFUtils.extend(MFFormScopeActions, MFDataViewScopeBuilder.actionsClass);

            MFFormScopeActions.prototype.isNew = function() {
				return  this.$scope.itemId === 'new' || this.$scope.itemId === '-1';
            };

            MFFormScopeActions.prototype.isCancelable = function() {
                return this.$scope.viewConfig.cancelable;
            };

            MFFormScopeActions.prototype.isDirty = function() {
                return this.form.$dirty;
            };

             MFFormScopeActions.prototype.isValid = function() {
                 return this.form.$valid;
             };

             MFFormScopeActions.prototype.isRemovable = function() {
                return this.$scope.viewConfig.deleteAction !== undefined;
            };


          // Form Edition

            MFFormScopeActions.prototype.isEditable = function() {
                return this.$scope.viewConfig.saveAction !== undefined;
            };

            MFFormScopeActions.prototype.isInEditionMode = function() {
                return this.$scope.editMode;
            };

            MFFormScopeActions.prototype.goInEditionMode = function() {

                if (this.isCancelable() && this.$scope.viewModel && this.isEditable()) {
                    this.viewModelBackup = this.$scope.viewModel.clone();
                }
                this.$scope.editMode = this.isEditable();
            };

            MFFormScopeActions.prototype.goOutEditionMode = function() {
                if (this.$scope.editMode) {
                    // this.$scope.$screenScope.viewConfig.screenConfig
                    this.$scope.editMode = false || this.$scope.$screenScope.viewConfig.screenConfig.disabledModeNonEditable;

                    this.form.$setPristine();
                    this.submitted = false;
                }
            };

           // Form Cancellation
            MFFormScopeActions.prototype.cancel = function() {
                if (this.isCancelable()) {
                    if (this.viewModelBackup) {
                        this.$scope.viewModel = this.viewModelBackup;
                    }
                    this.viewModelBackup = null;

                    this.goOutEditionMode();

                    // If we're in permanent edition mode, go back to Edition mode
                    if (this.$scope.$screenScope.viewConfig.screenConfig.disabledModeNonEditable) {
                        this.goInEditionMode();
                    }
                }

            };

            // Form Saving

            MFFormScopeActions.prototype.save = function() {
                var deferred = $q.defer();
                var self = this;


                if (!angular.isUndefinedOrNullOrEmpty(this.$scope.viewConfig.saveAction)) {

                    self.submitted = true;

                    if(self.isValid()){
                        var action = this.$scope.viewConfig.saveAction.createInstance();

                        MFActionLauncher.launchActions(
                            [{ action: action, params: {
                                viewModel: self.$scope.viewModel
                            }}
                            ], true, false
                        ).then(function (context) {
                                   self.goOutEditionMode();
                                if(self.$scope.viewConfig.formName === 'configurationForm'){
                                    self.rootActions.showInfoNotification('action.save.successfirsttime');
                                }else{
                                    self.rootActions.showInfoNotification('action.save.success');
                                }
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

            MFFormScopeActions.prototype.remove = function(){
                var deferred = $q.defer();
                var self = this;

                if(!angular.isUndefinedOrNull(this.$scope.viewConfig.deleteAction)) {

                    var action = this.$scope.viewConfig.deleteAction.createInstance();

                    MFActionLauncher.launchActions(
                            [{ action: action, params: {}}], true, false).then(function(context) {
                                self.rootActions.showInfoNotification('action.delete.success');
                                self.rootActions.showNotifications(context.messages);
                                self.goOutEditionMode();
                                deferred.resolve(context);
                            }, function(context) {
                                self.rootActions.showErrorNotification('action.delete.failure');
                               self.rootActions.showNotifications(context.messages);
                                deferred.reject(context);
                            });
                }
                else {
                    this.rootActions.showErrorNotification('$scope.viewConfig.deleteAction is not defined');
                    deferred.reject();
                }

                return deferred.promise;
            };

            MFFormScopeActions.prototype.init = function(initListener) {
                var deferred = $q.defer();

                this.$scope.viewConfig.isList = false;
                var self = this;

                MFFormScopeActions._super.init.call(this, initListener).then(
                    function() {
                        console.assert(!angular.isUndefined(self.$scope.$screenScope.viewConfig.screenConfig.exitState), '"$scope.viewConfig.screenConfig.exitState" is required in '+self.$scope.$screenScope.viewConfig.viewName);
                        console.assert(!angular.isUndefinedOrNull(self.$scope.$screenScope.viewConfig.screenConfig.exitOnSave), '"$scope.$screenScope.viewConfig.screenConfig.exitOnSave" is required in '+self.$scope.$screenScope.viewConfig.viewName);
                        console.assert(!angular.isUndefinedOrNull(self.$scope.$screenScope.viewConfig.screenConfig.exitOnCancel), '"$scope.$screenScope.viewConfig.screenConfig.exitOnCancel" is required in '+self.$scope.$screenScope.viewConfig.viewName);
                        console.assert(!angular.isUndefinedOrNull(self.$scope.$screenScope.viewConfig.screenConfig.exitWithoutSaving), '"$scope.$screenScope.viewConfig.screenConfig.exitWithoutSaving" is required in '+self.$scope.$screenScope.viewConfig.viewName);
                        console.assert(!angular.isUndefinedOrNullOrEmpty(self.$scope.viewConfig.formName), '"$scope.viewConfig.formName" is required in '+self.$scope.viewConfig.viewName);
                        console.assert(!angular.isUndefinedOrNull(self.form), self.$scope.viewConfig.formName+' is unknown. Are you sure that $scope.viewConfig.formName ===  name of the HTML form ?');
                        console.assert(!angular.isUndefinedOrNull(self.$scope.viewConfig.cancelable), '"$scope.viewConfig.cancelable" is required in '+self.$scope.viewConfig.viewName);
                        console.assert(angular.isUndefinedOrNull(self.$scope.viewConfig.saveAction) || angular.isObject(self.$scope.viewConfig.saveAction) && angular.isFunction(self.$scope.viewConfig.saveAction.createInstance), '$scope.viewConfig.saveAction is not valid');
                        console.assert(angular.isUndefinedOrNull(self.$scope.viewConfig.deleteAction) || angular.isObject(self.$scope.viewConfig.deleteAction) && angular.isFunction(self.$scope.viewConfig.deleteAction.createInstance), '$scope.viewConfig.deleteAction is not valid');

                        if(angular.isUndefinedOrNullOrEmpty(self.$scope.itemId)){
                            self.$scope.itemId = 'new';
                        }

                        deferred.resolve();

                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            };

            var MFFormScopeBuilder = function MFFormScopeBuilder() {};

             MFFormScopeBuilder.actionsClass = MFFormScopeActions;

             MFFormScopeBuilder.init = function($scope, initListener) {
                 $scope.actions = new MFFormScopeActions($scope);
                 // Init screen, then goInEditionMode if needed
                 return $scope.actions.init(initListener).then(function() {
                     if ($scope.actions.isNew() && $scope.rootActions.isEditable() ) {
                         $scope.rootActions.goInEditionMode();
                     }
                 });
            };

            return MFFormScopeBuilder;
        }]);