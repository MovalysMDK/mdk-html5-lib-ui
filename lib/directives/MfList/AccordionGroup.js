'use strict';

angular.module('template/accordion/accordion-group.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/accordion/accordion-group.html',
            '<div class="panel panel-default">\n' +
            '  <div class="panel-heading"  ng-click="toggleOpen()">\n' +
            '    <h4 class="panel-title">\n' +
            '      <span ng-class="{\'text-muted\': isDisabled}" class="accordion-toggle" accordion-transclude="heading">{{heading}}</span>\n' +
            '    </h4>\n' +
            '  </div>\n' +
            '  <div class="panel-collapse" collapse="!isOpen">\n' +
            '	  <div class="panel-body" ng-transclude></div>\n' +
            '  </div>\n' +
            '</div>');
}]);
