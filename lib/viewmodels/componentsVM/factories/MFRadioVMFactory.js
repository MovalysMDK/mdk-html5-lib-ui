'use strict';
/**
 * @file MFRadioVMFactory.js
 * @brief Photo model for view model (ask Laurent ;))
 * @author Jean-Daniel Borowy <jeandaniel.borowy@sopra.com>
 * @date 03/04/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFRadioVMFactory', ['MFRadioVM', function (MFRadioVM) {
	var MFRadioVMFactory = function MFRadioVMFactory() {
	};

	MFRadioVMFactory.prototype.createInstance = function(valueAttribute) {

        console.assert(!angular.isUndefinedOrNullOrEmpty(valueAttribute),'the parameter "valueAttribute" is mandatory');

		var newInstance = new MFRadioVM();
		newInstance.itemsList = [];
		newInstance.selectedItemValue = -1;
		newInstance.valueAttribute = valueAttribute;

		return newInstance;
	};

	return new MFRadioVMFactory();
}]);
