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

                    }
                };
            }
        };

    }
]);