'use strict';
/**
 * Created by mdefrutosvila on 09/04/2014.
 *
 * @file MfTextfield.js
 * @brief
 * @date 09/04/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



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
                mfAutocomplete: '@',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfTextfield/MfTextfield.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        /*
                         * attributes with '=' (two way data binding) cannot be modified in compile.
                         * Example: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                         */
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel', 'mfAutocompleteForce'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel', 'mfPlaceholder', 'mfAutocomplete', 'mfAutocompleteLimit'], false);

                        MFDirectivesHelper.checkValueIsNumber(iAttrs, ['mfAutocompleteLimit']);

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
                                //self.domElement.find('input').triggerHandler('focus');
                                self.domElement.find('input')[0].focus();
                                //we have to do that because of an incompatibility between ngTouch and the Bootstrap's modal
                                // see https://github.com/angular/angular.js/issues/6432
                                // see https://github.com/angular-ui/bootstrap/issues/2017
                            },0);
                        };

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer(iAttrs.mfCssClassContainer);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs);

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        //for the custom-format and custom-validation
                        scope.mfFormat = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomFormat);
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        //for the optional autocomplete parameter
                        scope.autocompleteList = [];
                        scope.mfTypehead = 'item for item in autocompleteList | filter:$viewValue';
                        if (iAttrs.mfAutocomplete){
                            scope.autocompleteList = scope.$parent[iAttrs.mfAutocomplete];
                            if (iAttrs.mfAutocompleteLimit){
                                scope.mfTypehead += ' | limitTo:' + iAttrs.mfAutocompleteLimit;
                            }
                            if (iAttrs.mfAutocompleteForce){
                                scope.mfTypeaheadEditable = false;
                            }
                        }
                    },

                    post: function postLink(scope, iElement, iAttrs, formController) {
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);
                    }
                };
            }

        };

    }
]);
