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
 * Directive : mf-combo
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
angular.module('mfui').directive('mfCombo', ['MFDirectivesHelper', '$compile',
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
                mfHasBlankRow: '@',
                mfDisplayedAttributes: '@',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfCombo/MfCombo.html',
            
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField', 'mfDisplayedAttributes']);

                        //attributes with '=' (two way data binding) cannot be modified in compile. Ex: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfRequired', 'mfReadonly', 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);
                        
                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHasBlankRow'], true);

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;
                        scope.mfHasBlankRow = iAttrs.mfHasBlankRow;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;

                        //content of <option> elements
                        scope.displayedAttributes = MFDirectivesHelper.parseAttributesNameList(iAttrs.mfDisplayedAttributes);
                        
                        
                        // Select the first element if none is selected yet and we have no blank row
                        if (scope.mfField.selectedItem === null &&
                            !scope.mfHasBlankRow &&
                            scope.mfField.itemsList &&
                            scope.mfField.itemsList.length > 0) {
                          scope.mfField.selectedItem = scope.mfField.itemsList[0];
                        }
                        
                        scope.getContent = function(item) {
                            return MFDirectivesHelper.concatAttributesValues(item, scope.displayedAttributes);
                        };
                    }
                };
            }
        };

    }
]);
