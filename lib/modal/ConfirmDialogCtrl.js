'use strict';

angular.module('mfui').controller('ConfirmDialogCtrl', function($scope, $modalInstance, DialogsConfig, header, msg, msgParam, showNo, showCancel) {
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
	};

	$scope.no = function () {
		$modalInstance.close(false);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});