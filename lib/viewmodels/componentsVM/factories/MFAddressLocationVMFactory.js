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
