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

angular.module('mfui').directive('mfCheckbox', ['MFDirectivesHelper',
    function(MFDirectivesHelper) {

        return {

            restrict: 'E',

            transclude: false,

            require: '^form',

            scope: {
                mfCustomValidation: '&',
                mfField: '=',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfOnchange: '&',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfCheckbox/MfCheckbox.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfField']);

                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        scope.mfId = MFDirectivesHelper.calculateId(iAttrs,formController);

                        scope.mfLabelId = iAttrs.mfId + '_label';

                        scope.hideLabel = function() {
                            return iAttrs.mfHideLabel || angular.isUndefinedOrNullOrEmpty(iAttrs.mfLabel);
                        };

                        scope.requiredField = function() {
                            return iAttrs.mfRequired;
                        };

                        //for the custom-validation
                        scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;
                    },

                    post: function postLink(scope, iElement, iAttrs, formController) {
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);
                        
                        var checkbox = angular.element(iElement).find('label')[0];
                        checkbox.addEventListener('touchend', function(event){
                                if(scope.mfField === true){
                                    scope.$apply(function() {
                                        scope.mfField = false;
                                    });
                                }
                                else {
                                    scope.$apply(function() {
                                        scope.mfField = true;
                                    });
                                }
                                event.stopPropagation();
                        });
                        
                        
                        checkbox.addEventListener('click', function(event){
                                event.stopPropagation();
                        });
                    }
                };
            }

        };

    }
]);
