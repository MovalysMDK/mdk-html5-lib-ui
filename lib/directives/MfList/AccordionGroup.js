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

angular.module('template/accordion/accordion-group.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/accordion/accordion-group.html',
            '<div>\n' +
            '  <div class="panel-heading"  ng-click="toggleOpen()" ng-class="{\'text-muted\': isDisabled}" accordion-transclude="heading">\n' +
            '<span>{{heading}}</span>' +
            '  </div>\n' +
            '  <div class="mdk-panel-collapse" collapse="!isOpen">\n' +
            '	  <div class="mdk-panel-body" ng-transclude></div>\n' +
            '  </div>\n' +
            '</div>');
}]);
