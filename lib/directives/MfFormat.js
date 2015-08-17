'use strict';
/**
 * Created by mdefrutosvila on 11/06/2014.
 *
 * @file MfFormat.js
 * @brief it searches in the scope for a mf-custom-format function, and if proceeds it is applied
 * @date 11/06/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */


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
