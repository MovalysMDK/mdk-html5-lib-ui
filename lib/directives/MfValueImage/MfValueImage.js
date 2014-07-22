'use strict';
/**
 *
 * @file MfValueImage.js
 * @brief
 * @date 24/06/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */



/**
 * Directive : mf-value-image
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-max-width          : max width
 *      # mf-max-height         : max height
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 */
angular.module('mfui').directive('mfValueImage', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

        return {
            restrict: 'E',

            replace: true,

            transclude: false,

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfHideLabel: '@',
                mfCssClassContainer: '@',
                mfId: '@',
                mfMaxWidth:'@',
                mfMaxHeight:'@'
            },

            templateUrl: 'mfui/directives/MfValueImage/MfValueImage.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, [ 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfMaxWidth', 'mfMaxHeight'], false, '100px');

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.imgStyle = function () {
                            return {
                                'minHeight': '50px' ,
                                'maxHeight': iAttrs.mfMaxHeight ,
                                'maxWidth': iAttrs.mfMaxWidth
                            };
                        };

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                    }
                };
            }
        };

    }
]);
