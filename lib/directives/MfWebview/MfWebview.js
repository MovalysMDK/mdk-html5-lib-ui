'use strict';
/**
 * Created by belamrani on 10/02/2016
 *
 * @file MfWebview.js
 * @brief
 * @date 10/02/2016
 *
 * Copyright (c) 2016 Sopra Steria Group. All rights reserved.
 *
 */



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
