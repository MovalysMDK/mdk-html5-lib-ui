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
 * Directive : mf-value-image
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 */
angular.module('mfui').directive('mfValueImage', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

        function updatePicture(scope, iAttrs) {
          // Is there a selection ?
          if (scope.mfField && scope.mfField.selectedItem) {
            scope.pictureURI = 'assets/pictures/' + scope.mfField.selectedItem.key + '.' + iAttrs.mfImageExtension;
            scope.pictureName = scope.mfField.selectedItem.key;
          }
        }

        return {
            restrict: 'E',

            transclude: false,

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfHideLabel: '@',
                mfCssClassContainer: '@',
                mfId: '@'
            },

            templateUrl: function(elem,attrs){
                   return 'mfui/directives/MfValueImage/MfValueImage.html';
            },

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {
                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);
                        
                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, [ 'mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);
                        
                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfImageExtension'], false, 'png');

                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;
                        
                        // Prepare picture
                        updatePicture(scope, iAttrs);
                        
                        scope.$watch('mfField.selectedItem', function() {
                            updatePicture(scope, iAttrs);
                        });
                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                    }
                };
            }
        };

    }
]);
