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

            }
        };
    }
);