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