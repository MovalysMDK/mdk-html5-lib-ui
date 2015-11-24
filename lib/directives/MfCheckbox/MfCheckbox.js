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
                    }
                };
            }

        };

    }
]);
