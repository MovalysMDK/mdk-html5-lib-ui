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
