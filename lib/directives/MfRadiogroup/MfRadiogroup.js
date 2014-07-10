'use strict';
/**
 * Created by fgouy on 10/06/2014 (from legacy code created on 07/03/2014, by tvinchent).
 *
 * @file MfRadiogroup.js
 * @brief
 * @date 10/06/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */



/**
 * Directive : mf-radiogroup
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *      # mf-displayed-attributes : attribute(s) of an item object to display as the text value
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-required           : true if the value of this field cannot be null
 *      # mf-readonly           : true if this field is in read-only mode
 *      # mf-onchange           : function to call in controller when change has occurred on input
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 */
angular.module('mfui').directive('mfRadiogroup', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

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
                mfDisplayedAttributes: '@',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfRadiogroup/MfRadiogroup.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField', 'mfDisplayedAttributes']);

                        //attributes with '=' (two way data binding) cannot be modified in compile. Ex: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfRequired', 'mfReadonly', 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;


                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);

                        // Need to set 'name' attribute and use $compile to wire input into form controller
                        // var inputElement = angular.element(iElement.find('input'));
                        // inputElement.attr('name', iAttrs.mfId);

                        //$compile(iElement)(scope);

                        scope.displayedAttributes = MFDirectivesHelper.parseAttributesNameList(iAttrs.mfDisplayedAttributes);

                        scope.getContent = function(item) {
                            return MFDirectivesHelper.concatAttributesValues(item, scope.displayedAttributes);
                        };

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                        // Listening state $invalid to show message
                        iElement.on('input', function(){
                            MFDirectivesHelper.watchInputForErrors(scope, formController, iElement);
                        });

                        //Enable watch if have mf-onchange param declared in directive
                        MFDirectivesHelper.watchOnChange(iAttrs, scope);
                    }
                };
            }
        };

    }
]);
