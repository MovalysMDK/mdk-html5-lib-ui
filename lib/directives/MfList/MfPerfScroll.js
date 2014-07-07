/**
 * Created by Sergio Contreras on 30/04/2014.
 *
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */

/**
 * Directive : mf-perf-scroll
 *
 * Listening scroll event to broadcast items of list to disable watchers when is not visible in viewport
 */

'use strict';

angular.module('mfui').directive('mfPerfScroll',
    function() {
        return {
            link: function(scope, element, attrs) {

                function updatePartialView(needDigest) {

                    // Broadcast to all elements with suspendable directive
                    if (needDigest) {
                        console.log('Broadcast to all elements with suspendable directive');
                        scope.$broadcast('suspend');
                        scope.$digest();
                        scope.$broadcast('resume');
                    }
                }

                // In scroll event of the view update elements state with suspendable directive
                angular.element(window.document).on('scroll', function() {
                    updatePartialView(true);
                });

//                scope.$watchCollection(attrs.faFastScroll, function() {
//                    // we're already in a $digest
//                    updatePartialView(false);
//                });
            }
        };
    }
);