'use strict';
/**
 * Created by mdefrutosvila on 09/05/2014.
 *
 * @file MfSubcontrolbar.js
 * @brief ui component similar to MfCOntrolbar
 *          The differences are:
 *              - the layout (this sub control bar is thinner, and at the top of the view but not at the top of the screen)
 *              - the default buttons available: there is no "back" button in this sub control bar
 *              - the conditions of display of the buttons are linked directly to the current scope.viewConfig (no bind to do with a parent scope)
 *              - the behavior on the click of the buttons is linked directly to functions of the current scope.actions
 *
 * @date 09/05/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



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

        replace: true,

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
                $scope.actions.save();
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
