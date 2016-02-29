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
 * Directive : mf-webview
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 */
angular.module('mfui').directive('mfWebview', ['MFDirectivesHelper', '$compile','$timeout','$sce',
    function(MFDirectivesHelper, $compile, $timeout, $sce) {

        return {
            restrict: 'A',

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfHideLabel: '@',
                mfId: '@'
            },

            templateUrl:  function(elem,attrs){
                return 'mfui/directives/MfWebview/MfWebview.html';
            },

            controller: function controller($scope, $attrs){
            },

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfLabel'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        //scope.mfField = scope.mfField + "&output=embed";
                        //window.location.replace(url);
                        //scope.mfField = scope.mfField + '&output=embed';

                        scope.mfField = $sce.trustAsResourceUrl(scope.mfField);

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        scope.isEmpty = function isEmpty(){
                            return angular.isUndefinedOrNullOrEmpty(scope.mfField);
                        };

                        scope.domElement = iElement;


                    }
                };
            }
        };

    }
]);
