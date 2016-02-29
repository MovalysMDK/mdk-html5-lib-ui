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
