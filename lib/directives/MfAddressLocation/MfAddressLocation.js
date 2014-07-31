'use strict';
/**
 * Created by scontreras on 09/06/2014.
 *
 * @file MfAddressLocation.js
 * @brief
 * @date 09/06/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */
angular.module('mfui').directive('mfAddressLocation', ['MFDirectivesHelper', 'MFCordova', '$cordovaGeolocation','$window','$timeout','MFLocationHelper','MFAddressLocationVMFactory',
    function(MFDirectivesHelper, MFCordova, $cordovaGeolocation,$window,$timeout,MFLocationHelper,MFAddressLocationVMFactory) {

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
                mfCssClassContainer: '@',
                mfLongitudePlaceholder: '@',
                mfLatitudePlaceholder: '@',
                mfId: '@',
                mfZoom:'@'
            },

            templateUrl: 'mfui/directives/MfAddressLocation/MfAddressLocation.html',

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);
                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);
                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel', 'mfPlaceholder', 'mfLongitudePlaceholder', 'mfLatitudePlaceholder'], false);
                        MFDirectivesHelper.checkOptionalIntegerAttributes(iAttrs, ['mfZoom'], 7 );


                        MFDirectivesHelper.calculateId(iAttrs, formController);

                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);


                        scope.positionURL = '#';

                        scope.$watch(iAttrs.mfField,function(newValue,oldValue){
                            scope.positionURL = MFLocationHelper.getPositionURL(scope.mfField,scope.mfZoom, scope.mfLabel);

                        });

                        MFLocationHelper.init(scope.mfField, scope.mfZoom, scope.mfLabel).then(function(){
                            scope.positionURL = MFLocationHelper.getPositionURL(scope.mfField,scope.mfZoom, scope.mfLabel);
                        });

                        scope.getCurrentPosition = function getCurrentPosition(){
                            MFLocationHelper.getCurrentPosition(scope.mfField).then(function success(){
                                scope.positionURL = MFLocationHelper.getPositionURL(scope.mfField,scope.mfZoom, scope.mfLabel);
                                scope.actions.rootActions.showInfoNotification('Position found');
                            },
                            function error(){
                                scope.actions.rootActions.showErrorNotification('Position not found');
                            });
                        };

                        scope.clearFields = function clearFields(){
                            MFLocationHelper.clearFields(scope.mfField);
                            scope.positionURL = '#';
                        };
                    },
                    post: function postLink(scope, iElement, iAttrs, formController) {
                    }
                };
            }

        };

    }
]);