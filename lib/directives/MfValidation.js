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
        ngModelController.$validators.customValidator = function(modelValue, viewValue){
            if (scope.mfValidation === true) {
                var valid = scope.mfCustomValidation()({
                    viewValue: viewValue
                });
                scope.msgError = valid;

                if(angular.isUndefinedOrNull(valid)){
                    //the value is valid
                    return true;
                } else{
                    //the value is invalid
                    return false;
                }
            }
            //the value is valid if no custom Validator has been set to the input value.
            return true;
        };
    }

    return {
        restrict: 'A',
        transclude: false,
        require: 'ngModel',
        link: link
    };

});
