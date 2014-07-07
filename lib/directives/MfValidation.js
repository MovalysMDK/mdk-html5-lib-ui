'use strict';
/**
 * Created by mdefrutosvila on 12/06/2014.
 *
 * @file MfValidation.js
 * @brief it searches in the scope for a mf-custom-validation function, and if proceeds it is applied
 * @date 11/06/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */


/**
 * Directive : mf-validation
 *
 * This directive has sense in an input that is included in a mfui directive.
 * Its purpouse is to watch if the mfui directive has the optional attribute "mf-custom-validation" and applies it
 *
 * The mfui directive should set a scope boolean variable called mfValidation
 * scope.mfValidation possible values true / false: determine if scope has mf-custom-validation
 *
 */
angular.module('mfui').directive('mfValidation', function () {
    function link(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.unshift(function (viewValue) {
            if (scope.mfValidation === true) {
                var valid = scope.mfCustomValidation({
                    viewValue: viewValue
                });
                ngModelController.$invalid = !valid;
            }
            return viewValue;
        });
    }

    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        require: 'ngModel',
        link: link
    };

});
