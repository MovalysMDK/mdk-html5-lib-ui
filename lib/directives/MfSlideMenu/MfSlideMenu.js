'use strict';
/**
 * Created by Sergio Contreras on 12/05/2014.
 *
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */

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
