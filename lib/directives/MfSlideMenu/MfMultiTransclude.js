'use strict';

angular.module('mfui').directive('mfMultiTransclude', function() {
    return {
        controller: function($scope, $element, $attrs, $transclude) {
            if (!$transclude) {
                throw {
                    name: 'DirectiveError',
                    message: 'ng-multi-transclude found without parent requesting transclusion'
                };
            }
            this.$transclude = $transclude;
        },

        link: function($scope, $element, $attrs, controller) {
            console.log('====> Multi Transclude....');
            var attach = function(clone) {
                angular.forEach(clone, function(child) {
                    if (angular.isFunction(child.getAttribute) && child.getAttribute('name') === $attrs.mfMultiTransclude) {
                        $element.html('');
                        $element.append(child);
                    }
                });
            };

            if (controller.$transclude.$$element) {
                attach(controller.$transclude.$$element);
            } else {
                controller.$transclude(function(clone) {
                    controller.$transclude.$$element = clone;
                    attach(clone);
                });
            }
        }
    };
});