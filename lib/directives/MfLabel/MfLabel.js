'use strict';
/**
 * Created by mdefrutosvila on 04/04/2014.
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
 *      # mf-text           : (herited from mf-label) label to set above this field
 *
 * Optional parameters :
 *      # mf-required-field : (herited from mf-required) true if the value of this field cannot be null
 *      # mf-hide-label     : (herited from mf-hide-label) true if the label must be hidden
 *
 */
angular.module('mfui').directive('mfLabel', ['MFDirectivesHelper', '$compile',
    function(MFDirectivesHelper, $compile) {

        return {

            restrict: 'E',

            transclude: false,

            scope: {
                mfText: '@',
                mfFor: '@mfAssociatedField'
            },

            templateUrl: 'mfui/directives/MfLabel/MfLabel.html',

            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfAssociatedField','mfText']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfRequiredField', 'mfHideLabel'], false);

                        scope.mfId = iAttrs.mfAssociatedField + '_label';

                        scope.mfRequiredField = iAttrs.mfRequiredField;

                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {}
                };
            }
        };

    }
]);