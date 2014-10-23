'use strict';
/**
 * Created by mdefrutosvila on 28/05/2014.
 *
 * @file MfDoublefield.js
 * @brief
 * @date 28/05/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



/**
 * Directive : mf-doublefield
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-label              : label to set above this field
 *      # mf-required           : true if the value of this field cannot be null
 *      # mf-readonly           : true if this field is in read-only mode
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *      # mf-placeholder        : the text inside the pristine input
 *      # mf-min                : the min value
 *      # mf-max                : the max value
 *      # mf-integer-min-digits : the min digits for the integer part of the double value
 *      # mf-integer-max-digits : the max digits for the integer part of the double value
 *      # mf-decimal-min-digits : the min digits for the decimal part of the double value
 *      # mf-decimal-max-digits : the max digits for the decimal part of the double value
 *      # mf-forbid-negative    :
 *
 */
angular.module('mfui').directive('mfDoublefield', ['MFDirectivesHelper', '$compile','$timeout',
    function(MFDirectivesHelper, $compile, $timeout) {

        function calculatePattern (attrs){
            //We're defining here the control of the number of the min/max digits for all parts of the double
            var customPattern = '/^';

            //If negative values are allow or not
            if (!attrs.mfForbidNegative){
                customPattern += '(\\-)?';
            }

            customPattern += '[0-9]';


            //First for the Integers
            if (attrs.mfIntegerMinDigits) {
                //There must be at least one integer digit
                var integerMin = attrs.mfIntegerMinDigits;
                if(integerMin==='0' ){
                    integerMin = '1';
                }

                if (attrs.mfIntegerMaxDigits) {
                    //If both min and max are defined for the integer digits
                    customPattern += '{' + integerMin + ',' + attrs.mfIntegerMaxDigits + '}';
                } else {
                    //If only a min is defined for the integer digits
                    customPattern += '{' + integerMin +'}[0-9]*';
                }
            } else {
                if (attrs.mfIntegerMaxDigits) {
                    //If only a max is defined for the integer digits
                    customPattern += '{1,' + attrs.mfIntegerMaxDigits + '}';
                } else {
                    //If no min or max digits are defined for our integer
                    customPattern += '+';
                }
            }

            //Then for the digits
            if (attrs.mfDecimalMinDigits) {
                if (attrs.mfDecimalMaxDigits) {
                    //If both min and max are defined for the decimal digits
                    if(attrs.mfDecimalMaxDigits!=='0' ) {
                        if(attrs.mfDecimalMinDigits==='0' ) {
                            customPattern += '([\\.|\\,][0-9]{1,' + attrs.mfDecimalMaxDigits + '})?';
                        }
                        else {
                            customPattern += '[\\.|\\,][0-9]{'+ attrs.mfDecimalMinDigits +',' + attrs.mfDecimalMaxDigits + '}';
                        }
                    }
                } else {
                    //If only a min is defined for the decimal digits
                    if(attrs.mfDecimalMinDigits==='0' ) {
                        customPattern += '([\\.|\\,][0-9]+)?';
                    } else if (attrs.mfDecimalMinDigits==='1' ) {
                        customPattern += '[\\.|\\,][0-9]+';
                    } else {
                        customPattern += '[\\.|\\,][0-9]{'+attrs.mfDecimalMinDigits+'}[0-9]*';
                    }
                }
            } else {
                if (attrs.mfDecimalMaxDigits) {
                    //If only a max is defined for the decimal digits
                    if(attrs.mfDecimalMaxDigits==='1' ) {
                        customPattern += '([\\.\\,][0-9])?';
                    } else if(attrs.mfDecimalMaxDigits!=='0' ) {
                        customPattern += '([\\.\\,][0-9]([0-9]{0,'+ (attrs.mfDecimalMaxDigits-1) + '}))?';
                    }
                } else {
                    //If no min or max digits are defined for our decimal
                    customPattern += '([\\.\\,][0-9]+)?';
                }
            }
            customPattern += '$/';

            return customPattern;
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
                // mfOnchange: '&',
                // mfCustomValidation: '&',
                // mfCustomFormat: '&',
                mfId: '@',
                mfMin: '@',
                mfMax: '@',
                mfIntegerMinDigits: '@',
                mfIntegerMaxDigits: '@',
                mfDecimalMinDigits: '@',
                mfDecimalMaxDigits: '@',
                mfForbidNegative: '@'
            },

            templateUrl: 'mfui/directives/MfDoublefield/MfDoublefield.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        //attributes with '=' (two way data binding) cannot be modified in compile. Ex: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel', 'mfForbidNegative'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, [
                            'mfCssClassContainer', 'mfLabel', 'mfPlaceholder', 'mfMin', 'mfMax', 'mfIntegerMinDigits',
                            'mfIntegerMaxDigits', 'mfDecimalMinDigits', 'mfDecimalMaxDigits'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);

                        scope.mfPattern = calculatePattern(iAttrs);

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;
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

                        /* TODO review when version of angular is undated
                         There is a bug in the thrown error of the component number in angular 1.2.15 .
                         We have noticed it while developing mf-integerfield.
                         $error.number doesn't work correctly. It throws $error.required instead.
                         $error.required is set to true not only if the field is empty, but also when the field is incorrect
                         (when $error.number should be true). No other error, even a customed one purposefully in an error
                         state (ng-pattern) will not be set to true.

                         This could happen because angular behavior with validations is to not let the user enter wrong values.
                         For example if the input is type=number and you try to type a letter in the field, angular won't allow it
                         and will empty the field, firing then the required error because the field is empty.
                         */

                        if(!Modernizr.inputtypes.number){
                        	console.error('Your browser does not support the HTML5 feature "Number input field"');
                            //scope.actions.rootActions.showErrorNotification('Your browser does not support the HTML5 feature "Number input field"');
                        }

                    }
                };
            }

        };

    }
]);
