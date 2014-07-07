'use strict';
/**
 * @file MFPhotoVM.js
 * @brief Photo model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFPhotoVMFactory', ['MFPhotoVM', 'MFPhotoState','MFAddressLocationVMFactory','MFComboVMFactory', function (MFPhotoVM, MFPhotoState,MFAddressLocationVMFactory,MFComboVMFactory) {
	var MFPhotoVMFactory = function MFPhotoVMFactory() {
	};

	MFPhotoVMFactory.prototype.createInstance = function() {
		var newInstance = new MFPhotoVM();
		newInstance.name = '';
		newInstance.uri = '';
		newInstance.date = new Date();
		newInstance.desc = '';
		newInstance.photoState = MFComboVMFactory.createInstance('value');
        newInstance.photoState.itemsList = MFPhotoState.toItemsList();
        newInstance.photoState.selectedItem = MFPhotoState.FWK_NONE;
        newInstance.photoLocation = MFAddressLocationVMFactory.createInstance();

		return newInstance;
	};

	return new MFPhotoVMFactory();
}]);
