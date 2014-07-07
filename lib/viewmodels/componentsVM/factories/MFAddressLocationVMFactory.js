'use strict';
/**
 * @file MFAddressLocationVMFactory.js
 * @brief Photo model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFAddressLocationVMFactory', ['MFAddressLocationVM', function (MFAddressLocationVM) {
	var MFAddressLocationVMFactory = function MFAddressLocationVMFactory() {
	};

	MFAddressLocationVMFactory.prototype.createInstance = function() {
		var newInstance = new MFAddressLocationVM();
		newInstance.latitude = null;
		newInstance.longitude = null;
		newInstance.street = '';
		newInstance.compl = '';
		newInstance.city = '';
		newInstance.country = '';

		return newInstance;
	};

	return new MFAddressLocationVMFactory();
}]);
