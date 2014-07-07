'use strict';
/**
 * @file MFValueImageVMFactory.js
 * @date 7/07/2014
 *
 * Copyright (c) 2014 Sopra Group. All rights reserved.
 *
 */

angular.module('mfui').factory('MFValueImageVMFactory', ['MFValueImageVM','MFPictureTypeEnum', function (MFValueImageVM,MFPictureTypeEnum) {
	var MFValueImageVMFactory = function MFValueImageVMFactory() {
	};

    MFValueImageVMFactory.prototype.createInstance = function(valueAttribute, pictureType, pictureDir) {

        var newInstance = new MFValueImageVM();

        console.assert(!angular.isUndefinedOrNullOrEmpty(valueAttribute),'the parameter "valueAttribute" is mandatory');
        newInstance.valueAttribute = valueAttribute;

        if(angular.isUndefinedOrNull(pictureDir)){
            newInstance.pictureDir = 'assets/pictures';
        }
        else {
            newInstance.pictureDir = pictureDir;
        }

        if(angular.isUndefinedOrNull(pictureType)){
            newInstance.pictureType = MFPictureTypeEnum.png;
        }
        else {
            console.assert(pictureType instanceof MFPictureTypeEnum,'the parameter "pictureType" should be a MFPictureTypeEnum');
            newInstance.pictureType = pictureType;
        }

		return newInstance;
	};

	return new MFValueImageVMFactory();
}]);
