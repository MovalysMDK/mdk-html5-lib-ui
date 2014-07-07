'use strict';

angular.module('mfui').factory('DialogsConfig', function(){

	return {
		controller : {
			confirm : 'ConfirmDialogCtrl',
			error : 'ErrorDialogCtrl'
		},
		templateUrl : {
			confirm : 'mfui/modal/confirm.html',
			error: 'mfui/modal/error.html'
		}
	};
});