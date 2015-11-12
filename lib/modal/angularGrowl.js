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
