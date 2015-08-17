'use strict';
/**
 * Created by mdefrutosvila on 02/04/2014.
 *
 * @file MfWatchers.js
 * @brief directive to show current watchers on scope, just for debug
 * @date 02/04/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



/**
 * Directive : mf-watchers
 *
 * Mandatory parameters :
 *
 */
angular.module('mfui').directive('mfWatchers', function () {

	var watchersContainedIn = function(scope) {
		var watchers = (scope.$$watchers) ? scope.$$watchers.length : 0;
		var child = scope.$$childHead;
		while (child) {
			watchers += (child.$$watchers) ? child.$$watchers.length : 0;
			child = child.$$nextSibling;
		}
		return watchers;
	};

	return {

		restrict: 'E',

		transclude: false,

		//scope: true,

		template: '<div><span ng-bind="watchers" class="badge progress-bar-danger"></span>&nbsp;<a href="" ng-click="wcount()">$Watchers</a></div>',

		controller: function compile($scope, $timeout) {
			$scope.wcount = function() {
				$timeout(function() {
					$scope.watchers = watchersContainedIn($scope); //$rootScope
				});
			};
			$scope.wcount();
		}
	};

});
