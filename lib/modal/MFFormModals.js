'use strict';


angular.module('mfui').service('MFFormModals', [ '$modal', 'DialogsConfig', function($modal, DialogsConfig){

	var config = {
		confirm : {
			header : 'modal.unsaveddata.header',
			msg : 'modal.unsaveddata.message'
		},
		error : {
			header : 'modal.invaliddata.header',
			msg : 'modal.invaliddata.message'
		},
		remove : {
			header : 'modal.confirmdelete.header',
			msg : 'modal.confirmdelete.message'
		},
		showNo : true,
		showCancel : true
	};

	var openConfirmModal = function(settings){
		var header = config.confirm.header,
			msg = config.confirm.msg,
			showNo = config.showNo,
			showCancel = config.showCancel;
		if (settings && settings.header){
			header = settings.header;
		}
		if (settings && settings.msg){
			msg = settings.msg;
		}
		if (settings && settings.showCancel){
			showCancel = settings.showCancel;
		}
		if (settings && settings.showNo){
			showNo = settings.showNo;
		}
		return $modal.open({
			templateUrl : DialogsConfig.templateUrl.confirm,
			controller : DialogsConfig.controller.confirm,
			resolve : {
				header : function() { return header; },
				msg : function() { return msg; },
                msgParam: function() { return ''; },
				showNo : function() { return showNo; },
				showCancel : function() { return showCancel; }
			}
		});
	};

	var openRemoveModal = function(item){
		return $modal.open({
			templateUrl : DialogsConfig.templateUrl.confirm,
			controller : DialogsConfig.controller.confirm,
			resolve : {
				header : function() {
                    return config.remove.header;
                },
				msg : function() {
                    return config.remove.msg;
                },
				msgParam: function() {
                    return item;
                },
				showNo : function() { return false; },
				showCancel : function() { return true; }
			}
		});
	};

	var openErrorModal = function(errors){
		if (errors === undefined) {
			errors = [config.error.msg];
		}
		return $modal.open({
			templateUrl : DialogsConfig.templateUrl.error,
			controller : DialogsConfig.controller.error,
			resolve : {
				header : function() { return config.error.header; },
				errors : function() { return errors; }
			}
		});
	};

	return {
		openConfirmModal: openConfirmModal,
		openRemoveModal: openRemoveModal,
		openErrorModal: openErrorModal
	};
}]);