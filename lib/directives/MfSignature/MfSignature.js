'use strict';
/**
 * Created by jdborowy on the end of the project.
 *
 * @file MFLabelManuBoUrl.js
 * @date 04/04/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



/**
 * Directive : mf-label
 *
 * Mandatory parameters :
 *      # mf-associated-field: (herited from mf-field) name of this field
 *      # mf-associated-field: (herited from mf-field) name of this field
 *      # mf-text           : (herited from mf-label) label to set above this field
 *
 * Optional parameters :
 *      # mf-required : (herited from mf-required) true if the value of this field cannot be null
 *      # mf-hide-label     : (herited from mf-hide-label) true if the label must be hidden
 *      # mf-width-canvas   : width of the canvas for the signature
 *      # mf-height-canvas   : height of the canvas for the signature
 *      # mf-move-buffer-radius : step between 2 points
 *
 */
angular.module('mfui').directive('mfSignature', ['MFDirectivesHelper', '$compile', '$swipe','MFIntegerConverter',
    function(MFDirectivesHelper, $compile, $swipe,MFIntegerConverter) {

        return {

            restrict: 'E',

            replace: true,

            transclude: false,

            require: '^form',

            templateUrl: 'mfui/directives/MfSignature/MfSignature.html',

            scope : {
                mfField: '=',
                mfLabel: '@',
                mfReadonly: '=',
                mfRequired: '@',
                mfHideLabel: '@',
                mfCssClassContainer: '@',
                mfWidthCanvas: '@',
                mfHeightCanvas: '@',
                mfId: '@',
                mfMoveBufferRadius: '@'
            },

            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfField']);

                        //attributes with '=' (two way data binding) cannot be modified in compile. Ex: <mf-textfield mf-required ...> must be setted <mf-textfield mf-required="true" ...>
                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, [ 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, [ 'mfHideLabel', 'mfRequired'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        MFDirectivesHelper.calculateId(iAttrs, formController);
                        scope.mfId = iAttrs.mfId;

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer( iAttrs, scope);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs, scope);

                        if(!angular.isUndefinedOrNullOrEmpty(iAttrs.mfMoveBufferRadius)){
                            $swipe.config.MOVE_BUFFER_RADIUS = MFIntegerConverter.fromString(iAttrs.mfMoveBufferRadius);
                        }


                        //to control and style validation errors
                        scope.getCssError = function getCssError(ngModelController) {
                            return {
                                'has-success': !scope.error.required && scope.dirty,
                                'has-error': scope.error.required && (scope.dirty || this.actions.submitted)
                            };
                        };

                        scope.showError = function showError(ngModelController, error) {
                            return (scope.dirty || this.actions.submitted) && scope.error[error];
                        };


                        if(angular.isUndefinedOrNullOrEmpty(iAttrs.mfWidthCanvas)){
                            scope.mfWidthCanvas = 500;
                        }
                        else {
                            scope.mfWidthCanvas = iAttrs.mfWidthCanvas;
                        }
                        if(angular.isUndefinedOrNullOrEmpty(scope.mfHeightCanvas)){
                            scope.mfHeightCanvas = 300;
                        }
                        else {
                            scope.mfHeightCanvas = iAttrs.mfHeightCanvas;
                        }

                        scope.pathConnected = [];

                        // Configure the canvas
                        scope.canvasHtmlElement = iElement[0].getElementsByClassName('mfSignatureCanvas')[0];
                        scope.canvasNgElement = iElement.find('canvas');
                        scope.context = scope.canvasHtmlElement.getContext('2d');
                        scope.context.lineWidth = 4;
                        scope.context.strokeStyle = '#000';

                        $swipe.bind(scope.canvasNgElement, {
                            'start': function (coords, event) {
                                if(!scope.canvasHtmlElement.disabled){
                                    var x= coords.x-scope.canvasHtmlElement.getBoundingClientRect().left;
                                    var y= coords.y-scope.canvasHtmlElement.getBoundingClientRect().top;
                                    console.log('start line at ('+x+','+y+')');

                                    scope.pathConnected.push([x, y]);
                                    scope.context.moveTo(x, y);
                                    scope.context.stroke();
                                }

                            },
                            'move': function (coords, event) {
                                if(!scope.canvasHtmlElement.disabled) {
                                    var x= coords.x-scope.canvasHtmlElement.getBoundingClientRect().left;
                                    var y= coords.y-scope.canvasHtmlElement.getBoundingClientRect().top;
                                    console.log('continue line between ('+scope.pathConnected[scope.pathConnected.length-1]+') and ('+x+','+y+')');

                                    scope.pathConnected.push([x, y]);
                                    scope.context.lineTo(x, y);
                                    scope.context.stroke();
                                }
                            },
                            'end': function (coords, event) {
                                if(!scope.canvasHtmlElement.disabled) {
                                    var x= coords.x-scope.canvasHtmlElement.getBoundingClientRect().left;
                                    var y= coords.y-scope.canvasHtmlElement.getBoundingClientRect().top;
                                    console.log('end line between ('+scope.pathConnected[scope.pathConnected.length-1]+') and ('+x+','+y+')');

                                    scope.pathConnected.push([x, y]);
                                    scope.context.lineTo(x, y);
                                    scope.context.stroke();
                                    if(!angular.isArray(scope.mfField)){
                                        scope.mfField = [];
                                    }
                                    scope.mfField.push(scope.pathConnected);
                                    scope.pathConnected = [];
                                    scope.dirty = true;
                                }
                            },
                            'cancel':function (coords, event) {
                                if(!scope.canvasHtmlElement.disabled) {
                                    scope.pathConnected = [];
                                    console.log('touchcancel fired by the browser because interpreted as a scroll',event);
                                }
                            }
                        });

                        scope.clear = function(){
                            if(!scope.canvasHtmlElement.disabled) {
                                scope.mfField = [];
                                scope.dirty = true;
                            }
                        };


                        scope.paint = function(canvasElement, data) {
                            console.debug('painting the signature...');
                            var context = canvasElement.getContext('2d');
                            context.clearRect(0, 0,
                                canvasElement.width,
                                canvasElement.height);
                            context.beginPath();
                            for (var i = 0, ii = data.length; i < ii; ++i) {
                                var pathConnected = data[i];
                                context.moveTo(pathConnected[0][0], pathConnected[0][1]);
                                for (var j = 1, jj = pathConnected.length; j < jj; ++j) {
                                    context.lineTo(pathConnected[j][0], pathConnected[j][1]);
                                }
                            }
                            context.stroke();
                        };
                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {

                        scope.error = {
                            required:false
                        };
                        scope.dirty = false;

                        scope.$parent.$watchCollection(iAttrs.mfField,
                            function(newValue, oldValue){
                                if(scope.mfRequired === true){
                                    scope.error.required = angular.isUndefinedOrNullOrEmpty(newValue);
                                    controller.$setValidity('required', !scope.error.required  );
                                }
                                if(angular.isArray(newValue) && (angular.isUndefinedOrNullOrEmpty(newValue) || angular.isUndefinedOrNullOrEmpty(oldValue)) && newValue !== oldValue){
                                    scope.paint(scope.canvasHtmlElement, newValue);
                                }
                            });
                    }
                };
            }
        };

    }]);