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

angular.module('mfui').factory('MFRootScopeBuilder', ['MFException', '$injector', '$state', '$stateParams', '$q', 'MFSyncPromiseProvider',
    'MFViewScopeBuilder', 'MFGenericLoadDataAction', 'MFActionLauncher', 'MFUpdateVMWithDataLoaderAction', 'MFUtils', 'MFFormModals', 'growl', 'MFConfigurationService', 'snapRemote', 'MFDeviceInfo', '$translate', 'MFCordova', '$anchorScroll', '$location',
    function (MFException, $injector, $state, $stateParams, $q, $qSync, MFViewScopeBuilder, MFGenericLoadDataAction, MFActionLauncher, MFUpdateVMWithDataLoaderAction, MFUtils, MFFormModals, growl, MFConfigurationService, snapRemote, MFDeviceInfo, $translate, MFCordova, $anchorScroll, $location) {
        var MFRootScopeBuilder = function MFRootScopeBuilder() {
        };

        var MFRootScopeActions = function MFRootScopeActions($scope) {
            MFRootScopeActions._Parent.call(this, $scope);
            this.rootActions = this;
            $scope.rootActions = this;
            $scope.$screenScope = null;
            $scope.$workspaceScope = null;
            $scope.$formScopes = [];
            $scope.$listScopes = [];

        };

        MFUtils.extend(MFRootScopeActions, MFViewScopeBuilder.actionsClass);

        // VIEW REGISTRATION METHODS

        MFRootScopeActions.prototype.setScreenScope = function ($screenScope) {
            console.assert(this.$scope.$screenScope === null, 'You have set two screen scopes or used $state.go instead of rootActions.go');
            this.$scope.$screenScope = $screenScope;
            this.$scope.$formScopes.clear();
            this.$scope.$listScopes.clear();
            this.$scope.editMode = $screenScope.editMode;
        };

        MFRootScopeActions.prototype.registerFormScope = function ($formScope) {

            for (var i = 0; i < this.$scope.$formScopes.length; i++) {
                if (this.$scope.$formScopes[i] === $formScope ||
                    this.$scope.$formScopes[i].viewConfig.viewName === $formScope.viewConfig.viewName
                ) {
                    break;
                }
            }

            this.$scope.$formScopes[i] = $formScope;
        };

        MFRootScopeActions.prototype.unregisterFormScope = function ($formScope) {
            var index = this.$scope.$formScopes.indexOf($formScope);
            if (index > -1) {
                this.$scope.$formScopes.splice(index);
            }
        };

        MFRootScopeActions.prototype.registerListScope = function ($listScope) {

            for (var i = 0; i < this.$scope.$listScopes.length; i++) {
                if (this.$scope.$listScopes[i] === $listScope ||
                    this.$scope.$listScopes[i].viewConfig.viewName === $listScope.viewConfig.viewName
                ) {
                    break;
                }
            }

            this.$scope.$listScopes[i] = $listScope;

        };

        MFRootScopeActions.prototype.unregisterListScope = function ($listScope) {
            var index;
            if ((index = this.$scope.$listScopes.indexOf($listScope)) > -1) {
                this.$scope.$listScopes.splice(index);
            }
        };

        MFRootScopeActions.prototype.registerWorkspaceScope = function ($workspaceScope) {
            this.$scope.$workspaceScope = $workspaceScope;
        };

        MFRootScopeActions.prototype.unregisterWorkspaceScope = function ($workspaceScope) {
            if (this.$scope.$workspaceScope === $workspaceScope) {
                this.$scope.$workspaceScope = null;
            }
        };

//  MESSAGES & POPUPS

        MFRootScopeActions.prototype.showNotifications = function (messages) {
            for (var i = 0; i < messages.length; ++i) {
                this.showNotification(messages[i]);
            }
        };

        MFRootScopeActions.prototype.showErrorNotification = function (msg, param) {

            var notif = {level: 'notification.error'};

            notif.message = msg;
            console.error(msg);

            this.showNotification(notif, param);
        };

        MFRootScopeActions.prototype.showInfoNotification = function (msg) {
            console.info(msg);

            this.showNotification({message: msg, level: 'notification.info'});
        };

        MFRootScopeActions.prototype.showWarningNotification = function (msg) {
            console.warn(msg);

            this.showNotification({message: msg, level: 'notification.warning'});
        };

        var getNotificationMessage = function (m) {
            var growlMessage = '';
            if (!angular.isUndefinedOrNullOrEmpty(m)) {

                if (!angular.isUndefinedOrNull(m.message)) {
                    if (angular.isString(m.message)) {
                        growlMessage = m.message;
                    }
                    else {
                        growlMessage = m.message.toString();
                    }
                }
                else {
                    if (angular.isString(m)) {
                        growlMessage = m;
                    }
                    else {
                        growlMessage = m.toString();
                    }
                }
            }
            return growlMessage;
        };
        MFRootScopeActions.prototype.showNotification = function (m, interpolateParams, closingTimeout) {
            var growlParams = {};
            console.assert(!angular.isUndefinedOrNull(m), 'the message to show should be defined');


            if (angular.isNumber(closingTimeout)) {
                growlParams.ttl = closingTimeout;
            }
            else {
                growlParams.ttl = MFConfigurationService.getValue('notificationsTimeout', -1);
            }
            if (!angular.isUndefinedOrNull(m.title)) {
                growlParams.title = m.title;
            }
            if (!angular.isUndefinedOrNullOrEmpty(m.messageParam)) {
                growlParams.variables = m.messageParam;
            }
            else if (!angular.isUndefinedOrNullOrEmpty(interpolateParams)) {
                growlParams.variables = interpolateParams;
            }


            var growlMessage = getNotificationMessage(m);


            if (m.level === 'notification.error') {
                growl.error(growlMessage, growlParams);
            }
            else if (m.level === 'notification.warning') {
                growl.warning(growlMessage, growlParams);

            }
            else if (m.level === 'notification.info') {
                growl.info(growlMessage, growlParams);
            }
            else {
                growl.success(growlMessage);
            }

        };


        MFCordova.onCordovaReady(
            function available() {
                if (navigator.notification && navigator.notification.alert && (angular.isUndefinedOrNullOrEmpty(MFDeviceInfo.deviceOS) || !MFDeviceInfo.deviceOS.includes('WINDOWS'))) {
                    MFRootScopeActions.prototype.showNotification = function (m, interpolateParams, closingTimeout) {
                        var title = '';
                        if (!angular.isUndefinedOrNull(m.title)) {
                            title = m.title;
                        }
                        else if (!angular.isUndefinedOrNull(m.level)) {
                            title = m.level;
                            if (m.level === 'notification.error' && MFConfigurationService.getValue('notificationVibrationEnable', true)) {
                                navigator.notification.vibrate(2000);
                            }
                        }
                        var message = getNotificationMessage(m);
                        if (m.messageParam) {
                            message = $translate.instant(message, m.messageParam);
                        }
                        else {
                            message = $translate.instant(message);
                        }

                        title = $translate.instant(title);

                        if (navigator.notification && navigator.notification.alert) {
                            navigator.notification.alert(message, null, title);
                        }
                    };
                }
            },
            function notAvailable() {
            }
        );

        // COMMON VIEWS

        MFRootScopeActions.prototype.go = function () {
            var currentScreenName = this.$scope.$screenScope.viewConfig.viewName;

            if (arguments[0] !== currentScreenName && arguments[0] !== currentScreenName + '.content') {
                var self = this;
                var args = arguments;
                if (args[0] !== '') {
                    if (self.isDirty()) {

                        var forgottenModificationsModal = MFFormModals.openConfirmModal();
                        if (forgottenModificationsModal !== undefined) {
                            forgottenModificationsModal.result.then(function (save) {
                                //Yes = save; No = go list; Cancel = dismiss modal
                                if (save) {
                                    self.save().then(function () {
                                        if (args[0] === 'goListWorkspace') {
                                            $state.go('^', {}, {
                                                reload: true,
                                                inherit: false,
                                                notify: true
                                            }).then(function () {
                                                self.rootActions.goOutEditionMode();
                                                $location.hash('firstColumn');
                                                $anchorScroll();
                                            });
                                        }
                                        else {
                                            self.shallGo.apply(self, args);
                                        }
                                    }, function () {
                                        console.log('save failed');
                                    });
                                } else {
                                    if (args[0] === 'goListWorkspace') {
                                        $state.go('^', {}, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        }).then(function () {
                                            self.rootActions.goOutEditionMode();
                                            $location.hash('firstColumn');
                                            $anchorScroll();
                                        });
                                    }
                                    else {
                                        self.shallGo.apply(self, args);
                                    }
                                }
                            });
                        }
                    } else {
                        if (args[0] === 'goListWorkspace') {
                            $state.go('^', {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            }).then(function () {
                                self.rootActions.goOutEditionMode();
                                $location.hash('firstColumn');
                                $anchorScroll();
                            });
                        }
                        else {
                            self.shallGo.apply(self, args);
                        }
                    }
                }
            }
        };

        MFRootScopeActions.prototype.shallGo = function () {
            // this.$scope.$screenScope.viewConfig.screenConfig
            this.$scope.editMode = false || this.$scope.$screenScope.viewConfig.screenConfig.forceInEditionMode;
            this.$scope.controlBarEnabled = false;
            this.$scope.$screenScope = null;
            this.$scope.$workspaceScope = null;
            this.$scope.$formScopes.clear();
            this.$scope.$listScopes.clear();


            snapRemote.close();
            if (arguments[0] === 'goHistoryBack') {
                if (this.$scope.hasReload) {
                    this.$scope.hasReload = false;
                    return setTimeout(function () {
                        window.history.go(-2);
                    }, 0);
                } else {
                    return setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            } else {
                this.$scope.hasReload = false;
                return $state.go.apply($state, arguments);
            }
        };

        MFRootScopeActions.prototype.goExitState = function () {
            var self = this;
            var exitState = self.$scope.$screenScope.viewConfig.screenConfig.exitState;
            if (exitState !== null) {
                self.go(
                    self.$scope.$screenScope.viewConfig.screenConfig.exitState,
                    MFUtils.isUndefinedOrNull(self.$scope.$screenScope.viewConfig.screenConfig.exitStateParams) ? {} : self.$scope.$screenScope.viewConfig.screenConfig.exitStateParams);
            }
        };

        MFRootScopeActions.prototype.goBack = function () {
            var self = this;
            if (!angular.isUndefinedOrNull(self.$scope.$workspaceScope) && !$state.$current.parent.abstract) {
                self.go('goListWorkspace');
            } else if (!angular.isUndefinedOrNull(self.$scope.$workspaceScope) && $state.$current.parent.abstract) {
                self.goExitState();
            } else if (!angular.isUndefinedOrNull(window.history)) {
                //go to the previous screen.
                this.go('goHistoryBack');
            } else if (self.$scope.$formScopes.length === 1) {
                $stateParams[self.$scope.$formScopes[0].actions.stateParamName] = 'new';
                $state.go($state.current.name, $stateParams);
            }
        };

        MFRootScopeActions.prototype.goReload = function () {
            var hasChanged = false;
            var formScopes = this.$scope.$formScopes;
            this.$scope.hasReload = true;
            for (var i = 0, ii = formScopes.length; !hasChanged && i < ii; ++i) {
                hasChanged = formScopes[i].itemIdHasChanged;
            }
            var self = this;
            if (hasChanged) {
                this.$scope.$formScopes.clear();
                if (angular.isUndefinedOrNull(this.$scope.$workspaceScope)) {
                    $state.go($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    }).then(function () {
                        self.rootActions.goOutEditionMode();
                    });
                } else {
                    $state.go('^', {}, {reload: true, inherit: false, notify: true}).then(function () {
                        self.rootActions.goOutEditionMode();
                    });
                }
            } else {
                if (angular.isUndefinedOrNull(this.$scope.$workspaceScope)) {
                    this.rootActions.goOutEditionMode();
                } else {
                    $state.go('^', {}, {reload: true, inherit: false, notify: true}).then(function () {
                        self.rootActions.goOutEditionMode();
                    });
                }
            }
        };


        //  FORMS
        MFRootScopeActions.prototype.isForm = function () {
            return this.$scope.$formScopes.length > 0;
        };

        MFRootScopeActions.prototype.canAddToList = function () {

            for (var i = 0; i < this.$scope.$listScopes.length; i++) {
                var currListScope = this.$scope.$listScopes[i];

                if (currListScope.actions.canAddToList()) {
                    return true;
                }
            }

            return false;
        };

        //  Form status
        MFRootScopeActions.prototype.isEditable = function () {
            var formScopes = this.$scope.$formScopes;
            var editable = false;
            for (var i = 0, ii = formScopes.length; !editable && i < ii; ++i) {
                editable = editable || formScopes[i].actions.isEditable();
            }
            return editable;
        };

        MFRootScopeActions.prototype.isRemovable = function () {
            var formScopes = this.$scope.$formScopes;
            var removable = false;
            for (var i = 0, ii = formScopes.length; !removable && i < ii; ++i) {
                removable = removable || formScopes[i].actions.isRemovable();
            }
            return removable;
        };

        MFRootScopeActions.prototype.isCancelable = function () {
            var formScopes = this.$scope.$formScopes;
            var cancelable = false;
            for (var i = 0, ii = formScopes.length; !cancelable && i < ii; ++i) {
                cancelable = cancelable || formScopes[i].actions.isCancelable();
            }
            return cancelable;
        };

        MFRootScopeActions.prototype.isDirty = function () {
            var formScopes = this.$scope.$formScopes;
            var dirty = false;
            for (var i = 0, ii = formScopes.length; !dirty && i < ii; ++i) {
                dirty = dirty || formScopes[i].actions.isDirty();
            }
            return dirty;
        };

        MFRootScopeActions.prototype.isNew = function () {
            var formScopes = this.$scope.$formScopes;
            var isNew = false;
            for (var i = 0, ii = formScopes.length; !isNew && i < ii; ++i) {
                isNew = isNew || formScopes[i].actions.isNew();
            }
            return isNew;
        };

        MFRootScopeActions.prototype.isExitable = function () {
            return !this.isForm() || this.$scope.$screenScope.viewConfig.screenConfig.exitWithoutSaving;
        };

        MFRootScopeActions.prototype.isBackable = function () {
            return !angular.isUndefinedOrNullOrEmpty(this.$scope.$screenScope.viewConfig.screenConfig.exitState) && this.isExitable();
        };

        //  Form actions
        MFRootScopeActions.prototype.save = function () {
            var deferred = $qSync.defer();
            var self = this;
            var formScopes = this.$scope.$formScopes;
            var actions = [];
            for (var i = 0, ii = formScopes.length; i < ii; ++i) {
                if (formScopes[i].viewConfig.saveAction) {
                    actions.push(formScopes[i].actions.save());
                }
            }
            $q.all(actions).then(function () {
                if (angular.isUndefinedOrNull(self.$scope.$workspaceScope)) {
                    console.log('Save success');
                    deferred.resolve();
                    //self.exitSaveMode();
                } else {
                    self.$scope.$workspaceScope.actions.save().then(function () {
                        console.log('Save workspace success');
                        deferred.resolve();
                        //self.exitSaveMode();
                    }, function () {
                        console.log('Save workspace fail');
                        deferred.reject();
                    });
                }
            }, function () {
                console.log('Save Fail');
                deferred.reject();
            });

            return deferred.promise;

        };

        MFRootScopeActions.prototype.exitSaveMode = function () {

            var self = this;

            if (self.$scope.$screenScope.viewConfig.screenConfig.exitOnSave) {
                self.goBack();
            }
            else {
                self.goReload();

            }
        };

        MFRootScopeActions.prototype.remove = function () {
            var self = this;
            var formScopes = this.$scope.$formScopes;
            var actions = [];
            for (var i = 0, ii = formScopes.length; i < ii; ++i) {
                if (!angular.isUndefinedOrNull(formScopes[i].viewConfig.deleteAction)) {
                    actions.push(formScopes[i].actions.remove());
                    if (!angular.isUndefinedOrNull(self.$scope.$workspaceScope) && actions.length > 0) {
                        break;
                    }
                }
            }
            $q.all(actions).then(function () {
                self.goBack();
            });
        };

        MFRootScopeActions.prototype.cancel = function () {
            var self = this;
            var formScopes = this.$scope.$formScopes;
            for (var i = 0, ii = formScopes.length; i < ii; ++i) {
                formScopes[i].actions.cancel();
            }
            this.goOutEditionMode();
            if (self.$scope.$screenScope.viewConfig.screenConfig.exitOnCancel) {
                self.goBack();
            }
        };

        MFRootScopeActions.prototype.isInEditionMode = function () {
            return this.$scope.editMode;
        };

        MFRootScopeActions.prototype.isForceInEditionMode = function () {
            return this.$scope.$screenScope.viewConfig.screenConfig.forceInEditionMode;
        };

        MFRootScopeActions.prototype.goInEditionMode = function () {
            for (var i = 0, ii = this.$scope.$formScopes.length; i < ii; ++i) {
                this.$scope.$formScopes[i].actions.goInEditionMode();
            }
            this.$scope.editMode = true;
        };

        MFRootScopeActions.prototype.goOutEditionMode = function () {
            for (var i = 0, ii = this.$scope.$formScopes.length; i < ii; ++i) {
                this.$scope.$formScopes[i].actions.goOutEditionMode();
            }
            // this.$scope.$screenScope.viewConfig.screenConfig
            this.$scope.editMode = false || this.$scope.$screenScope.viewConfig.screenConfig.forceInEditionMode;
        };
        //  List actions

        MFRootScopeActions.prototype.navigateNew = function () {
            console.assert(angular.isArray(this.$scope.$listScopes) && this.$scope.$listScopes.length > 0, 'There is no list registered on the root scope');

            for (var listScopeKey = 0; listScopeKey < this.$scope.$listScopes.length; ++listScopeKey) {
                console.assert(angular.isFunction(this.$scope.$listScopes[listScopeKey].actions.clearItemSelection), 'the function "clearItemSelection should be added to the panel scope by the directive MfList');
                this.$scope.$listScopes[listScopeKey].actions.clearItemSelection();
            }
            this.$scope.$listScopes[0].actions.navigateNew(); // we consider that all the lists have the same detail
            //this "navigateNew" is called by the plus button of the main control bar => add an item of level 0
        };

        MFRootScopeActions.prototype.init = function (initListener) {

        };

        MFRootScopeBuilder.actionsClass = MFRootScopeActions;

        MFRootScopeBuilder.init = function ($scope, initListener) {
            $scope.actions = new MFRootScopeActions($scope);
            return $scope.actions.init(initListener);
        };

        return MFRootScopeBuilder;
    }
]);
