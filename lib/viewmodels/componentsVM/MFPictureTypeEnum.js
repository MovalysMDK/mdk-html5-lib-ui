'use strict';


angular.module('mfcore').factory('MFPictureTypeEnum', ['MFAbstractEnum', function (MFAbstractEnum) {

	var MFPictureTypeEnum = function MFPictureTypeEnum() {};
	MFAbstractEnum.defineEnum(MFPictureTypeEnum, ['png','jpg', 'gif']);

	return MFPictureTypeEnum;
}]);
