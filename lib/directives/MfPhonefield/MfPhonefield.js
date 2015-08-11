'use strict';
/**
 * Created by fgouy on 09/06/2014 (from legacy code created on 05/03/2014).
 *
 * @file mfPhonefield.js
 * @brief
 * @date 09/06/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */



/**
 * Directive : mf-phonefield
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
 *      # mf-onchange           : function to call in controller when change has occurred on input
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *      # mf-placeholder        : the text inside the input
 */
angular.module('mfui').directive('mfPhonefield', ['MFDirectivesHelper', '$compile','$timeout',
    function(MFDirectivesHelper, $compile, $timeout) {

        function calculatePattern (){
            return '(\\+[0-9]{1,3})?[ ]?(\\([0-9]{1,3}\\))?[0-9]([ \\.\\-]?[0-9]{1,3}){0,4}[0-9]';
        }

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
                // mfCustomValidation: '&',
                // mfCustomFormat: '&',
                mfId: '@'
            },

            templateUrl: function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                    return 'mfui/directives/MfPhonefield/MfPhonefieldNoLabel.html';
                }
                return 'mfui/directives/MfPhonefield/MfPhonefield.html';
            },

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfField']);

                        //attributes with '=' (two way data binding) cannot be modified in compile. Ex: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfRequired', 'mfReadonly', 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel', 'mfPlaceholder'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.mfPattern = calculatePattern();

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        scope.isEmpty = function isEmpty(){
                            return angular.isUndefinedOrNullOrEmpty(scope.mfField);
                        };
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

                        if(!Modernizr.inputtypes.tel){
                            scope.actions.rootActions.showWarningNotification('Your browser does not support the HTML5 feature "Tel input field"');
                        }

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                        //Enable watch if have mf-onchange param declared in directive
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);
                    }
                };
            }
        };

    }
]);
