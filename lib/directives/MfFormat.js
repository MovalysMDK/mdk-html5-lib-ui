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
 * Directive : mf-format
 *
 * This directive has sense in an input that is included in a mfui directive.
 * Its purpouse is to watch if the mfui directive has the optional attribute "mf-custom-format" and applies it
 *
 * The mfui directive should set a scope boolean variable called mfFormat
 * scope.mfFormat possible values true / false: determine if scope has mf-custom-format
 *
 */
angular.module('mfui').directive('mfFormat', function () {
    function link(scope, element, attrs, ngModelController) {
        ngModelController.$formatters.unshift(function (modelValue) {
            if (scope.mfFormat === true) {
                var modelValueFormatted = scope.mfCustomFormat({
                    modelValue: modelValue
                });

                ngModelController.$setViewValue(modelValueFormatted);
                ngModelController.$setPristine();
                ngModelController.$render();
                return modelValueFormatted;
            } else {
                return modelValue;
            }
        });
    }

    return {
        restrict: 'A',
        transclude: false,
        require: 'ngModel',
        link: link
    };

});
