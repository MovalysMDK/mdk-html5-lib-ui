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

angular.module('mfui').controller('ConfirmDialogCtrl', function($rootScope, $scope, $modalInstance, DialogsConfig, header, msg, msgParam, showNo, showCancel) {
	$scope.header = header;
	$scope.msg = msg;
    $scope.msgParam = msgParam;

	$scope.showNo = function(){
		return showNo;
	};

	$scope.showCancel = function(){
		return showCancel;
	};

	$scope.hasHeader = function () {
		return $scope.header !== null;
	};

	$scope.ok = function () {
		$modalInstance.close(true);
		$rootScope.isModalOpened = false;
	};

	$scope.no = function () {
		$modalInstance.close(false);
		$rootScope.isModalOpened = false;
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		$rootScope.isModalOpened = false;
	};
});