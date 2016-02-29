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
 * Directive : mf-scrollable
 *
 * Make scrollable container with smooth mobile feeling
 */
angular.module('mfui').directive('mfSlideMenu',
    function() {

        return {

            restrict: 'E',

            replace: true,

            transclude: true,

            templateUrl: 'mfui/directives/MfSlideMenu/MfSlideMenu.html',

            controller: function controller($scope, $attrs) {
                $scope.opts = {
                    // https://github.com/jakiestfu/Snap.js#settings-and-defaults

                    //For default use right drawer
                    disable: 'right',
                    touchToDrag:true,
                    tapToClose:true
                };

                $scope.getCssWithControlbar = function() {
                    return {
                        'snapWithMargin': this.controlBarEnabled,
                        'snapWithoutMargin': !this.controlBarEnabled
                    };
                };
            }
        };

    }
);
