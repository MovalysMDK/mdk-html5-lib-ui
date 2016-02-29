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