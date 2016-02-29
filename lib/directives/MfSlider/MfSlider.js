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
 * Directive : mf-slider
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-label          : label to set above this field.
 *      # mf-required       : true if the value of this field cannot be null
 *      # mf-readonly       : true if this field is in read-only mode
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *      # mf-show-value     : false if you do not want to show the in-time value of the slider on the right. DEFAULT: true.
 *      # mf-min            : double. DEFAULT: 0.
 *      # mf-max            : double. DEFAULT: 10.
 *      # mf-step           : double. DEFAULT: 1.
 */

angular.module('mfui').directive('mfSlider', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

        return {

            restrict: 'E',

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfPlaceholder: '@',
                mfLabel: '@',
                mfShowValue: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfOnchange: '&',
                mfCustomValidation: '&',
                mfCustomFormat: '&',
                mfId: '@'
            },

            templateUrl: function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                    return 'mfui/directives/MfSlider/MfSliderNoLabel.html';
                }
                return 'mfui/directives/MfSlider/MfSlider.html';
            },


            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {


                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        scope.mfFormat = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomFormat);
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesInputContainer =  function() {
                            if (angular.isUndefinedOrNullOrEmpty(iAttrs.mfLabel) || iAttrs.mfHideLabel){
                                return 'col-sm-offset-2 col-sm-9';
                            }
                            return 'col-sm-9';
                        };

                        //Default values for mfMin , mfMax and mfStep
                        scope.mfMinValue = angular.isUndefined(iAttrs.mfMin) ? '0' : iAttrs.mfMin;
                        scope.mfMaxValue = angular.isUndefined(iAttrs.mfMax) ? '10' : iAttrs.mfMax;
                        scope.mfStepValue = angular.isUndefined(iAttrs.mfStep) ? '1' : iAttrs.mfStep;

                        //Default value for mfShowValue
                        scope.showValue = angular.isUndefined(iAttrs.mfShowValue) ? true : iAttrs.mfShowValue;

                        if(!Modernizr.inputtypes.range){
                        	console.error('Your browser does not support the HTML5 feature "range input field"');
                            //scope.actions.rootActions.showErrorNotification('Your browser does not support the HTML5 feature "range input field"');
                        }

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                    }
                };
            }

        };

    }
]);