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
 * Directive : mf-multilinefield
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-required           : true if the value of this field cannot be null
 *      # mf-readonly           : true if this field is in read-only mode
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *      # mf-placeholder        : the text inside the input
 *      # mf-custom-format      : adds a function to apply to the view formatter
 *      # mf-custom-validation  : adds a function to apply to the view validation
 *      # mf-rows           : the number of rows of the textarea
 *
 */
angular.module('mfui').directive('mfMultilinefield', ['MFDirectivesHelper','$timeout',
    function(MFDirectivesHelper, $timeout) {

        return {

            restrict: 'E',

            replace: true,

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfPlaceholder: '@',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfOnchange: '&',
                mfCustomValidation: '&',
                mfCustomFormat: '&',
                mfRows: '@',
                mfId: '@'
            },

            templateUrl: function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                    return 'mfui/directives/MfMultilinefield/MfMultilinefieldNoLabel.html';
                }
                return 'mfui/directives/MfMultilinefield/MfMultilinefield.html';
            },

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        /*
                         * attributes with '=' (two way data binding) cannot be modified in compile.
                         * Example: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                         */
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel', 'mfPlaceholder'], false);

                        MFDirectivesHelper.checkOptionalIntegerAttributes(iAttrs, ['mfRows'], 10);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;
                        scope.domElement = iElement;

                        scope.mfFormat = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomFormat);
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;


                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;
                        scope.domElement = iElement;
                        scope.getFocus = function(){
                            var self = this;
                            $timeout(function(){
                                self.domElement.find('textarea')[0].focus();
                                //we have to do that because of an incompatibility between ngTouch and the Bootstrap's modal
                                // see https://github.com/angular/angular.js/issues/6432
                                // see https://github.com/angular-ui/bootstrap/issues/2017
                                // see https://github.com/angular-ui/bootstrap/issues/2280
                            },0);
                        };

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);
                    }
                };
            }

        };

    }
]);
