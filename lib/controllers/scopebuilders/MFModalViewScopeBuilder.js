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

angular.module('mfui').factory('MFModalScopeBuilder', ['$q', 'MFDataViewScopeBuilder', 'MFUtils', 'MFViewScopeBuilder',
    function ($q, MFDataViewScopeBuilder, MFUtils, MFViewScopeBuilder) {
        var MFModalScopeBuilder = function MFModalScopeBuilder() {
        };

        var MFModalScopeActions = function MFModalScopeActions($scope) {
            Object.defineProperties(this, {
                $scope: {
                    value: $scope,
                    writable: false,
                    configurable: false,
                    enumerable: true
                }
            });

        };
        MFUtils.extend(MFModalScopeActions, MFViewScopeBuilder.actionsClass);


        MFModalScopeActions.prototype.isEditable = function () {
            return false;
        };

        MFModalScopeActions.prototype.isRemovable = function () {
            return false;
        };

        MFModalScopeActions.prototype.isCancelable = function () {
            return false;
        };

        MFModalScopeActions.prototype.isInEditionMode = function () {
            return true;
        };

        MFModalScopeActions.prototype.init = function (initListener) {
            var deferred = $q.defer();

            MFModalScopeActions._super.init.call(this, initListener).then(
                function () {
                    deferred.resolve();
                },
                function (error) {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };


        MFModalScopeBuilder.actionsClass = MFModalScopeActions;
        MFModalScopeBuilder.init = function ($scope, initListener) {
            $scope.actions = new MFModalScopeActions($scope);
            return true;
        };

        return MFModalScopeBuilder;
    }]);
