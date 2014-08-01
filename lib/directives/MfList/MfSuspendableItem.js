/**
 * Created by Sergio Contreras on 30/04/2014.
 *
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */

/**
 * Directive : mf-suspendable-item
 *
 * Make a item suspendable. Disable watchers of item when not visible in viewport
 */

'use strict';

angular.module('mfui').directive('mfSuspendableItem', ['MFDirectivesHelper',
    function(MFDirectivesHelper) {
        return {
            link: function(scope, element) {

                var watchers;

                scope.$on('suspend', function() {
                    //Check if element is visible in view port
                    var visible = MFDirectivesHelper.elementInViewport(element.off()[0]);
                    // Store watchers and clean in no visible elements
                    if (!visible) {
                        if (angular.isUndefined(watchers)) {
                            watchers = scope.$$watchers;
                        }
                        scope.$$watchers = [];
                    }
                });

                scope.$on('resume', function() {
                    //Check if element is visible in view port
                    var visible = MFDirectivesHelper.elementInViewport(element.off()[0]);
                    if (visible && !angular.isUndefinedOrNull(watchers)) {
                        // Restore watchers in visible elements
                        scope.$$watchers = watchers;
                        watchers = null;
                    }

                });
            }
        };
    }
]);