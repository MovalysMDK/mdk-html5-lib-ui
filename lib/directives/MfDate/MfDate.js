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
 * Directive : mf-date
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
 *      # mf-min-date
 *      # mf-max-date
 *
 *
 */
angular.module('mfui').directive('mfDate', ['MFDirectivesHelper', '$compile', '$filter','$timeout',
    function(MFDirectivesHelper, $compile, $filter, $timeout) {

        return {

            restrict: 'E',

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',//refers directly a property of the view scope
                mfCustomValidation: '&',
                mfDatePattern: '@',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfOnchange: '&',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfDate/MfDate.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfRequired', 'mfReadonly', 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel','mfMinDate','mfMaxDate'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;
                        scope.domElement = iElement;


                        //for the custom-validation
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        scope.getFocus = function(){
                            var self = this;
                            $timeout(function(){
                                self.domElement.find('input')[0].focus();
                                //we have to do that because of an incompatibility between ngTouch and the Bootstrap's modal
                                // see https://github.com/angular/angular.js/issues/6432
                                // see https://github.com/angular-ui/bootstrap/issues/2017
                            },0);
                        };

                        if(!Modernizr.inputtypes.date){
                        	console.error('Your browser does not support the HTML5 feature "Date input field"');
                            //scope.actions.rootActions.showErrorNotification('Your browser does not support the HTML5 feature "Date input field"');
                        }

                    },

                    post: function postLink(scope, iElement, iAttrs, formController) {
                        //Enable watch if have mf-onchange param declared in directive
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);

                        //Format date validation (Android has not full support of input type date in the browser)
                        var inputDate = iElement.find('input')[0];
                        inputDate.onblur = function() {
                            var dateFilter = $filter('date');
                            var dateString = dateFilter(inputDate.value, 'yyyy-MM-dd');
                            var date = new Date(dateString);
                            scope.mfField = date;
                        };
                    }
                };
            }

        };

    }
]);