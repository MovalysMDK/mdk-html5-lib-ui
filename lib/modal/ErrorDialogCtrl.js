'use strict';

angular.module('mfui').controller('ErrorDialogCtrl', function($scope, $modalInstance, DialogsConfig, header, errors) {
	$scope.header = header;
	$scope.errors = errors;

	$scope.ok = function () {
		$modalInstance.close();
	};
});