'use strict';
/**
 *
 * @file MfValueImage.js
 * @brief
 * @date 24/06/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */



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
