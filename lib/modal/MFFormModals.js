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


angular.module('mfui').service('MFFormModals', [ '$rootScope', '$modal', 'DialogsConfig', function($rootScope, $modal, DialogsConfig){

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

		if (typeof $rootScope.isModalOpened !== 'undefined') {
			if ($rootScope.isModalOpened) {
                            return;
                        }
		}
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

		$rootScope.isModalOpened = true;
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
