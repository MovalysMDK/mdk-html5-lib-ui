'use strict';
/**
 * Created by mdefrutosvila on 26/06/2014.
 *
 * @file MfPhotoInputUpdate.js
 * @brief
 * @date 26/06/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



/**
 * Directive : mf-photo-input-update
 *
 * Updates the scope with the selected image from an input type file
 *
 */

angular.module('mfui').directive('mfPhotoInputUpdate', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function (e) {
                scope.mfField.uri = e.target.result;
                scope.$apply();
            };

            elem.on('change', function() {
                reader.readAsDataURL(elem[0].files[0]);
            });
        }
    };
}]);