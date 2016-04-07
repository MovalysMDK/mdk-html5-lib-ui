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
* Directive : mf-slider
*
* Mandatory parameters :
*      # mf-field      : path to the object in the controller scope mapped with this field
*
* Optional parameters :
*      # mf-label          : label to set above this field.
*      # mf-required       : true if the value of this field cannot be null
*      # mf-readonly       : true if this field is in read-only mode
*      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
*      # mf-show-value     : false if you do not want to show the in-time value of the slider on the right. DEFAULT: true.
*      # mf-min            : double. DEFAULT: 0.
*      # mf-max            : double. DEFAULT: 10.
*      # mf-step           : double. DEFAULT: 1.
*/

angular.module('mfui').directive('mfSlider', ['MFDirectivesHelper', '$compile', '$document',
function (MFDirectivesHelper, $compile, $document) {

  return {

    restrict: 'E',

    transclude: false,

    require: '^form',

    scope: {
      mfField: '=',
      mfPlaceholder: '@',
      mfLabel: '@',
      mfShowValue: '@',
      mfRequired: '=',
      mfReadonly: '=',
      mfHideLabel: '@',
      mfCustomValidation: '&',
      mfCustomFormat: '&',
      mfMin: '@',
      mfMax: '@',
      mfId: '@'
    },

    templateUrl: 'mfui/directives/MfSlider/MfSlider.html',

    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink(scope, iElement, iAttrs, formController) {

          MFDirectivesHelper.calculateId(iAttrs, formController);

          scope.mfId = iAttrs.mfId;

          scope.getCssError = MFDirectivesHelper.getCssError;
          scope.showError = MFDirectivesHelper.showError;

          scope.mfFormat = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomFormat);
          scope.mfValidation = MFDirectivesHelper.informOptionalAttributeToNgModelController(iAttrs.mfCustomValidation);

          //to have access to the actions of the scope builders
          scope.actions = scope.$parent.actions;

          scope.getCssClassesInputContainer = function () {
            if (angular.isUndefinedOrNullOrEmpty(iAttrs.mfLabel) || iAttrs.mfHideLabel) {
              return 'col-sm-offset-2 col-sm-9';
            }
            return 'col-sm-9';
          };

          //Default values for mfMin , mfMax and mfStep
          scope.mfMinValue = angular.isUndefined(iAttrs.mfMin) ? '0' : iAttrs.mfMin;
          scope.mfMaxValue = angular.isUndefined(iAttrs.mfMax) ? '10' : iAttrs.mfMax;
          scope.mfStepValue = angular.isUndefined(iAttrs.mfStep) ? '1' : iAttrs.mfStep;

          scope.mfField = angular.isUndefined(scope.mfField) ? scope.mfMinValue : scope.mfField;

          //Default value for mfShowValue
          scope.showValue = angular.isUndefined(iAttrs.mfShowValue) ? true : iAttrs.mfShowValue;

        },

        post: function postLink(scope, iElement, iAttrs, formController) {

          var sliderBar = angular.element(iElement).find('.mdk-slider-active');
          var sliderPointer = angular.element(sliderBar).find('.mdk-slider-pointer');
          var sliderDisable = angular.element(iElement).find('.mdk-slider-disable');

          var sliderParent = sliderBar.parent();
          var left = sliderBar.offset().left;
          var width = sliderParent.width();

          var initSliderPointerPos = (scope.mfField*100 / ( parseInt(scope.mfMaxValue) -  parseInt(scope.mfMinValue))) - parseInt(scope.mfMinValue);
          sliderBar.css('width', initSliderPointerPos + '%');
          sliderDisable.css('width', initSliderPointerPos + '%');




          sliderPointer.on('touchstart', function (event) {
            scope.form.slider.$setDirty();
            $document.on('touchmove', function (event) {
              var sliderPointerPos = Math.round((event.originalEvent.touches[0].pageX - left) * 100 / (width));

              if (sliderPointerPos <= 100 && sliderPointerPos >= 0) {
                scope.$apply(function(){
                  scope.mfField = parseInt(scope.mfMinValue) + sliderPointerPos * (scope.mfMaxValue - scope.mfMinValue) / 100;
                });
                sliderBar.css('width', sliderPointerPos + '%');
              }
            });
            $document.on('touchend', function (event) {
              $document.off('touchmove');
              $document.off('touchend');
            });
            event.stopPropagation();
          });

          
          sliderPointer.on('mousedown', function (event) {
            event.stopPropagation();
            scope.form.slider.$setDirty();
            $document.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
            $document.on('mousemove', function (event) {
              var sliderPointerPos = Math.round((event.pageX - left) * 100 / (width));
              if (sliderPointerPos <= 100 && sliderPointerPos >= 0) {
                scope.$apply(function(){
                  scope.mfField = parseInt(scope.mfMinValue) + sliderPointerPos * (scope.mfMaxValue - scope.mfMinValue) / 100;
                });
                sliderBar.css('width', sliderPointerPos + '%');
              }
            });
            $document.on('mouseup', function (event) {
              $document.attr('unselectable', 'off').css('user-select', 'text').off('selectstart');
              $document.off('mousemove');
              $document.off('mouseup');
            });
          });

          sliderParent.parent().on('click', function (event) {
            var sliderPointerPosOnClick = Math.round((event.pageX - left) * 100 / (width));
            sliderBar.css('width', sliderPointerPosOnClick + '%');
            var newValue = parseInt(scope.mfMinValue) + sliderPointerPosOnClick * (scope.mfMaxValue - scope.mfMinValue) / 100;
            scope.form.slider.$setDirty();
            scope.$apply(function(){
              scope.mfField = (newValue < scope.mfMaxValue && newValue > scope.mfMinValue)? newValue : newValue > scope.mfMaxValue ? scope.mfMaxValue : scope.mfMinValue;
            });
            event.stopPropagation();

          });


        }
      };
    }

  };

}
]);
