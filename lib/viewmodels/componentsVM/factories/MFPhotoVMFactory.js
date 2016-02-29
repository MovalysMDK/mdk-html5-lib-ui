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
