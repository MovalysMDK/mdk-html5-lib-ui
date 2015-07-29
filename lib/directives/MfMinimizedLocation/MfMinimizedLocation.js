'use strict';

/**
 * Directive : mf-minimized-location
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-required           : true if the value of this field cannot be null
 *      # mf-readonly           : true if this field is in read-only mode
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *
 */
angular.module('mfui').directive('mfMinimizedLocation', ['MFDirectivesHelper', 'MFCordova', '$cordovaGeolocation','$window','$timeout','MFLocationHelper','MFBooleanConverter',
       function(MFDirectivesHelper, MFCordova, $cordovaGeolocation,$window,$timeout,MFLocationHelper,MFBooleanConverter) {

           return {

               restrict: 'E',

               replace: true,

               transclude: false,

               require: '^form',

               scope: {
                   mfField: '=',
                   mfLabel: '@',
                   mfRequired: '@',
                   mfReadonly: '=',
                   mfHideLabel: '@',
                   mfCssClassContainer: '@',
                   mfId: '@',
                   mfZoom:'@'
               },

               templateUrl: function(elem,attrs){
                   if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                       return 'mfui/directives/MfMinimizedLocation/MfMinimizedLocationNoLabel.html';
                   }
                   return 'mfui/directives/MfMinimizedLocation/MfMinimizedLocation.html';
               },

               compile: function compile(tElement, tAttrs, transclude) {
                   return {
                       pre: function preLink(scope, iElement, iAttrs, formController) {

                           MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);
                           MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);
                           MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);
                           MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);
                           MFDirectivesHelper.checkOptionalIntegerAttributes(iAttrs, ['mfZoom'], 7);

                           MFDirectivesHelper.calculateId(iAttrs, formController);

                           scope.mfId = iAttrs.mfId;

                           //to have access to the actions of the scope builders
                           scope.actions = scope.$parent.actions;

                           scope.positionURL = '#';
                           scope.positionRequested = false;

                           scope.$parent.$watch(iAttrs.mfField,function(newValue,oldValue){
                               scope.positionURL = MFLocationHelper.getPositionURL(newValue,scope.mfZoom, scope.mfLabel);
                               scope.positionRequested = ( scope.positionURL !== '#');

                           }, true);

                           MFLocationHelper.init(scope.mfField, scope.mfZoom, scope.mfLabel).then(
                               function(){
                                   scope.positionURL = MFLocationHelper.getPositionURL(scope.mfField,scope.mfZoom, scope.mfLabel);
                                   scope.positionRequested = ( scope.positionURL !== '#');
                               },
                               function (error){
                                   scope.actions.rootActions.showErrorNotification(error);

                               });

                           var getCurrentPosition = function getCurrentPosition(){
                               MFLocationHelper.getCurrentPosition(scope.mfField).then(function success(){
                                   scope.actions.rootActions.showInfoNotification('Position found');
                               },
                               function error(){
                                   scope.actions.rootActions.showErrorNotification('Position not found');
                                   scope.positionRequested = false;
                               });
                           };

                           scope.getMapCss = function(){
                               return {
                                   'btn-success': scope.positionURL !== '#',
                                   'btn-default': scope.positionURL === '#'
                               };
                           };

                           scope.onCheckboxChange = function onCheckboxChange(){
                               scope.positionRequested = MFBooleanConverter.fromString(scope.positionRequested);
                               if(scope.positionRequested){
                                   getCurrentPosition();
                               }
                               else {
                                   MFLocationHelper.clearFields(scope.mfField);
                                   scope.positionURL = '#';
                               }
                           };
                       },
                       post: function postLink(scope, iElement, iAttrs, formController) {
                       }
                   };
               }

           };

       }
]);