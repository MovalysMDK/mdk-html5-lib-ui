'use strict';

angular.module('mfui').directive(
    'mfDateTimeInput',['MFDateConverter',
        function(MFDateConverter) {
            return {
                require: 'ngModel',
                template: '<input type="datetime-local"/>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function(modelValue) {
                        return MFDateConverter.toDatetimeRFC3339(modelValue);

                    });

                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return MFDateConverter.fromDatetimeRFC3339(viewValue);
                    });
                }
            };
        }]);