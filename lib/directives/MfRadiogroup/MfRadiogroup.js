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
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 */
angular.module('mfui').directive('mfRadiogroup', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

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
                mfDisplayedAttributes: '@',
                mfId: '@'
            },

            templateUrl:  function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfReadonly'], true)){
                    return 'mfui/directives/MfRadiogroup/MfRadiogroupReadOnly.html';
                }
                return 'mfui/directives/MfRadiogroup/MfRadiogroup.html';
            },

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

                        scope.displayedAttributes = MFDirectivesHelper.parseAttributesNameList(iAttrs.mfDisplayedAttributes);

                        scope.getContent = function(item) {
                            return MFDirectivesHelper.concatAttributesValues(item, scope.displayedAttributes);
                        };

                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                        // Listening state $invalid to show message
                        iElement.on('input', function(){
                           // MFDirectivesHelper.watchInputForErrors(scope, formController, iElement);
                        });

                    }
                };
            }
        };

    }
]);
