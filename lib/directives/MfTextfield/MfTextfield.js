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
 * Directive : mf-textfield
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
 *      # mf-password           : change the type of the input to password
 *      # mf-autocomplete       : sets an autocomplete dropdown to the field. Its value is the name of the scope variable of the array with the autocomplete list
 *      # mf-autocomplete-limit : sets the limit of the results shown in the autocomplete dropdown
 *      # mf-autocomplete-force : forces the field validation to be one of the elements of the autocomplete list
 *
 */
angular.module('mfui').directive('mfTextfield', ['MFDirectivesHelper', '$compile','$timeout',
    function(MFDirectivesHelper, $compile,$timeout) {

        return {

            restrict: 'E',

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfPlaceholder: '@',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfCustomValidation: '&',
                mfCustomFormat: '&',
                mfAutocomplete: '@',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfTextfield/MfTextfield.html',

            compile : function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        /*
                         * attributes with '=' (two way data binding) cannot be modified in compile.
                         * Example: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                         */
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel', 'mfAutocompleteForce'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel', 'mfPlaceholder', 'mfAutocomplete'], false);

                        MFDirectivesHelper.checkOptionalIntegerAttributes(iAttrs, ['mfAutocompleteLimit']);

                        scope.mfType = 'text';
                        if (!angular.isUndefinedOrNull(iAttrs.mfPassword)){
                            scope.mfType = 'password';
                        }

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        scope.domElement = iElement;

                        scope.getFocus = function(){
                            var self = this;
                            $timeout(function(){
                                self.domElement.find('input')[0].focus();
                                //we have to do that because of an incompatibility between ngTouch and the Bootstrap's modal
                                // see https://github.com/angular/angular.js/issues/6432
                                // see https://github.com/angular-ui/bootstrap/issues/2017
                            },0);
                        };

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        //for the custom-format and custom-validation
                        scope.mfFormat = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomFormat);
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        //for the optional autocomplete parameter
                        scope.autocompleteList = [];
                        scope.mfTypehead = 'item for item in autocompleteList | filter:$viewValue';
                        if (iAttrs.mfAutocomplete ){
                            //using ui.bootstrap.typeahead
                            scope.autocompleteList = scope.$parent[iAttrs.mfAutocomplete];
                            if (iAttrs.mfAutocompleteLimit){
                                scope.mfTypehead += ' | limitTo:' + iAttrs.mfAutocompleteLimit;
                            }
                            if (iAttrs.mfAutocompleteForce){
                                scope.mfTypeaheadEditable = false;
                            }
                        }
                    }
                };
            }

        };

    }
]);
