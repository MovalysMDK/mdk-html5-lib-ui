'use strict';
angular.module('mfui').directive('mfStopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on(attr.mfStopEvent, function (e) {
                e.stopPropagation();
            });
        }
    };
});