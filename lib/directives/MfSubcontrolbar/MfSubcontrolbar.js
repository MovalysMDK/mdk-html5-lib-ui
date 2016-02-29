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

/**
 * Directive : mf-subcontrolbar
 *
 * Mandatory parameters :
 *
 * Optional parameters :
 *
 */
angular.module('mfui').directive('mfSubcontrolbar', [
    'MFDirectivesHelper','$translate',
    function (MFDirectivesHelper,$translate) {

    return {
        restrict: 'E',

        transclude: false,

        templateUrl: 'mfui/directives/MfSubcontrolbar/MfSubcontrolbar.html',

        controller: function controller($scope, $attrs){


            $scope.subcontrolbar = {};

            if(!angular.isUndefinedOrNullOrEmpty($scope.viewConfig.subControlBarTitle)){
                $translate($scope.viewConfig.subControlBarTitle).then(function(trad){
                    $scope.subcontrolbar.title = trad;
                });
            }
            else {
                MFDirectivesHelper.checkOptionalStringAttributes($attrs, ['mfTitle'], false);
                $translate($attrs.mfTitle).then(function(trad){
                    $scope.subcontrolbar.title = trad;
                });
            }

            $scope.subcontrolbar.buttonSave = function () {
                return $scope.actions.isInEditionMode();
            };
            $scope.subcontrolbar.buttonEdit = function () {
                return $scope.actions.isEditable() && !$scope.actions.isInEditionMode();
            };
            $scope.subcontrolbar.buttonCancel = function () {
                return $scope.actions.isCancelable() && $scope.actions.isInEditionMode();
            };
            $scope.subcontrolbar.buttonAdd = function () {
                return $scope.actions.canAddToList && $scope.actions.canAddToList();
            };
            $scope.subcontrolbar.buttonRemove = function () {
                return $scope.actions.isRemovable() && !$scope.actions.isInEditionMode();
            };


            //buttons actions logic
            $scope.subcontrolbar.goSave = function () {
                $scope.actions.save().then(function(){
                    $scope.rootActions.exitSaveMode();
                });
            };

            $scope.subcontrolbar.goEdit = function () {
                $scope.actions.goInEditionMode();
            };
            $scope.subcontrolbar.goCancel = function () {
                $scope.actions.cancel();
            };
            $scope.subcontrolbar.goAdd = function () {
                $scope.actions.navigateNew();
            };
            $scope.subcontrolbar.goRemove = function () {
                $scope.actions.remove();
            };
        },

        compile: function compile(tElement, tAttrs) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controllers) {
                },
                post: function postLink(scope, iElement, iAttrs, controlbarController) {
                }
            };
        }
    };

}]);
