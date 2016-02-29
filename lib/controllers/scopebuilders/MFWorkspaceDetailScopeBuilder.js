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

angular.module('mfui').factory('MFWorkspaceDetailScopeBuilder',
        ['$q', 'MFFormScopeBuilder', 'MFActionLauncher', 'MFUpdateVMWithDataLoaderAction', 'MFUtils','MFActionOnScroll',

         function ($q, MFFormScopeBuilder, MFActionLauncher, MFUpdateVMWithDataLoaderAction, MFUtils,MFActionOnScroll) {

            var MFWorkspaceDetailScopeActions = function MFWorkspaceDetailScopeActions($scope) {
                var self = this;

                MFWorkspaceDetailScopeActions._Parent.call(self, $scope);

                this.rootActions.registerFormScope($scope);
            };

             MFUtils.extend(MFWorkspaceDetailScopeActions, MFFormScopeBuilder.actionsClass);

             MFWorkspaceDetailScopeActions.prototype.init = function(initListener) {
                 var deferred = $q.defer();

                 this.$scope.viewConfig.isWorkspacePanel = true;
                 this.$scope.viewConfig.isList = false;

                 MFWorkspaceDetailScopeActions._super.init.call(this, initListener).then(
                         function() {

                             deferred.resolve();

                         },
                         function(error) {
                             deferred.reject(error);
                         }
                 );

                 return deferred.promise;
             };

             MFWorkspaceDetailScopeActions.prototype.doFillAction = function () {
                 var deferred = $q.defer();
                 var self = this;

                 try {

                     var updateVmAction = MFUpdateVMWithDataLoaderAction.createInstance();
                     updateVmAction.then(function(result) {
                         console.log('updateVM success', result);
                     }, function(error) {
                         console.log('updateVM failure', error);
                     });

                     var updateVmInputParams = {
                         dataLoader: this.$scope.$screenScope.viewConfig.dataLoader, // Load parent DataLoader
                         viewModelFactory: this.$scope.viewConfig.viewModelFactory,
                         viewModel: this.$scope.viewModel
                     };

                     MFActionLauncher.launchActions(
                         [{
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

            var MFWorkspaceDetailScopeBuilder = function MFWorkspaceDetailScopeBuilder() {};
            MFWorkspaceDetailScopeBuilder.init = function($scope, initListener) {
                $scope.actions = new MFWorkspaceDetailScopeActions($scope);

                setTimeout(function() {
                    if ($scope.actions.isNew() && $scope.rootActions.isEditable() ) {
                        $scope.rootActions.goInEditionMode();
                    }
                }, 0);

                return $scope.actions.init(initListener);
            };

            return MFWorkspaceDetailScopeBuilder;
        }]);