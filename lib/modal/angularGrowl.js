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

angular.module('mfui').run(['$templateCache', function($templateCache) {
    $templateCache.put('templates/growl/growl.html',
                       '<div class="growl-container" ng-class="wrapperClasses()" style="margin-top: 55px; max-width: 95%;">' +
                           '<div class="growl-item alert" ng-repeat="message in growlMessages.directives[referenceId].messages" ng-class="alertClasses(message)" ng-click="growlMessages.deleteMessage(message)" ng-swipe-left="growlMessages.deleteMessage(message)">' +
                               '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="growlMessages.deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button>' +
                               '<h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4>' +
                               '<div class="growl-message" ng-bind-html="message.text"></div>' +
                           '</div>' +
                       '</div>'
    );
}]);
