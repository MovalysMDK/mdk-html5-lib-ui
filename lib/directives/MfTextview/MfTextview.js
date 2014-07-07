'use strict';
/**
 * Created by fgouy on 12/06/2014.
 *
 * @file MfTextview.js
 * @brief
 * @date 12/06/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */



/**
 * Directive : mf-textview
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 */
angular.module('mfui').directive('mfTextview', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

        return {
            restrict: 'E',

            replace: true,

            transclude: false,

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfHideLabel: '@',
                // mfOnchange: '&',
                // mfCustomValidation: '&',
                // mfCustomFormat: '&',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfTextview/MfTextview.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfField']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer(iAttrs.mfCssClassContainer);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs);
                    }

                    // ,
                    // post: function postLink(scope, iElement, iAttrs, formController) {
                    // }
                };
            }
        };

    }
]);
