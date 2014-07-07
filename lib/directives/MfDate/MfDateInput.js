'use strict';

angular.module('mfui').directive(
    'mfDateInput',['MFDateConverter',
        function(MFDateConverter) {
            return {
                require: 'ngModel',
                template: '<input type="date"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function(modelValue) {
                        return MFDateConverter.toDateRFC3339(modelValue);
                    });

                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return MFDateConverter.fromDateRFC3339(viewValue);
                    });
                }
            };
        }]);