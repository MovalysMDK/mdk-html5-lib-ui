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

angular.module('mfui').directive('mfAddressLocation', ['MFDirectivesHelper', 'MFCordova', '$cordovaGeolocation','$window','$timeout','MFLocationHelper','MFAddressLocationVMFactory',
    function(MFDirectivesHelper, MFCordova, $cordovaGeolocation,$window,$timeout,MFLocationHelper,MFAddressLocationVMFactory) {

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
                mfCssClassContainer: '@',
                mfLongitudePlaceholder: '@',
                mfLatitudePlaceholder: '@',
                mfId: '@',
                mfZoom:'@'
            },

            templateUrl: function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                    return 'mfui/directives/MfAddressLocation/MfAddressLocationNoLabel.html';
                }
                return 'mfui/directives/MfAddressLocation/MfAddressLocation.html';
            },

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

                        scope.positionURL = '#';

                        scope.$parent.$watch(iAttrs.mfField,function(newValue,oldValue){
                            scope.positionURL = MFLocationHelper.getPositionURL(newValue,scope.mfZoom, scope.mfLabel);
                        }, true);

                        MFLocationHelper.init(scope.mfField, scope.mfZoom, scope.mfLabel).then(
                            function(){
                                scope.positionURL = MFLocationHelper.getPositionURL(scope.mfField,scope.mfZoom, scope.mfLabel);
                            },
                            function (error){
                            scope.actions.rootActions.showErrorNotification(error);

                            }
                        );

                        scope.getCurrentPosition = function getCurrentPosition(event){
                            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                                if(event.type == "touchend"){
                                    MFLocationHelper.getCurrentPosition(scope.mfField).then(function success(){
                                        scope.actions.rootActions.showInfoNotification('Position found');
                                    },
                                    function error(){
                                        scope.actions.rootActions.showErrorNotification('Position not found : the GPS must be activated to locate your device');
                                    });
                                }
                            }else{
                                MFLocationHelper.getCurrentPosition(scope.mfField).then(function success(){
                                    scope.actions.rootActions.showInfoNotification('Position found');
                                },
                                function error(){
                                    scope.actions.rootActions.showErrorNotification('Position not found');
                                });
                            }
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