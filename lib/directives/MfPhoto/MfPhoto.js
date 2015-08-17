'use strict';
/**
 * Created by mdefrutosvila on 25/06/2014.
 *
 * @file MfPhoto.js
 * @brief
 * @date 25/06/2014
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */



/**
 * Directive : mf-photo
 *
 * Mandatory parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *
 * Optional parameters :
 *      # mf-id                 : to set the id of the input field instead of calculating it
 *      # mf-label              : label to set above this field
 *      # mf-hide-label         : true to set mf-label hidden
 *      # mf-required           : true if the value of this field cannot be null
 *      # mf-readonly           : true if this field is in read-only mode
 *      # mf-css-class-container: the name of the class containing the custom style. Add your style in the custom scss file
 *
 */

angular.module('mfui').directive('mfPhoto', ['MFDirectivesHelper', '$modal', 'MFPhotoVMFactory','$timeout','MFCordova',
    function(MFDirectivesHelper, $modal, MFPhotoVMFactory,$timeout,MFCordova) {

        var _URL_NO_PHOTO_ = 'assets/pictures/nophoto.png';

        return {

            restrict: 'E',

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfNamePlaceholder: '@',
                mfThumbnailWidth: '@',
                mfThumbnailHeight: '@',
                mfDescriptionPlaceholder: '@',
                mfId: '@'
            },

            templateUrl:  function(elem,attrs){
                if(MFDirectivesHelper.checkOptionalBooleanAttributes(attrs, ['mfHideLabel'], false)){
                    return 'mfui/directives/MfPhoto/MfPhotoNoLabel.html';
                }
                return 'mfui/directives/MfPhoto/MfPhoto.html';
            },

            controller: function controller($scope, $attrs, $element, MFPhotoVMFactory) {
                var photoScope = $scope;
                var pictureSource;
                var destinationType;

                var openPhotoDialog = function(){
                    console.log('openPhotoDialog with HTML5');
                    document.getElementById(photoScope.mfIdInput).click();
                };

                // capture callback
                var captureWithCordovaSuccess = function(imageURI) {
                    photoScope.mfField.uri = imageURI;
                    photoScope.$apply();
                };

                // capture error callback
                var captureWithCordovaError = function(error) {

                    //prevent popup when the picture is cancelled
                    if(error !== 'Camera cancelled.') {
                        photoScope.actions.rootActions.showErrorNotification(error);
                    }
                };

                var ModalInstanceCtrl = function ModalInstanceCtrl($scope, $modalInstance, photo) {
                    var modalScope = $scope;
                    modalScope.photoUri = photo.uri;
                    modalScope.photoName = photo.name;
                    modalScope.ok = function () {
                        $modalInstance.close();
                    };
                };




                $element.find('img')[0].addEventListener('click',function(event){
                    if(!$element[0].disabled){
                        event.preventDefault();
                        openPhotoDialog();
                    }
                    else {
                        $modal.open({
                            templateUrl: 'mfui/directives/MfPhoto/MfPhotoDetail.html',
                            controller: ModalInstanceCtrl,
                            size: 'lg',
                            resolve: {
                                photo: function() {
                                    return photoScope.mfField;
                                }
                            }
                        });
                    }
                });


                MFCordova.onCordovaReady(
                    function available(){
                        pictureSource=navigator.camera.PictureSourceType;
                        destinationType=navigator.camera.DestinationType;
                        if(navigator.camera && navigator.camera.getPicture){
                            openPhotoDialog = function(){
                                console.log('openPhotoDialog with Cordova');
                                navigator.camera.getPicture(captureWithCordovaSuccess, captureWithCordovaError, { quality: 50, destinationType: destinationType.FILE_URI});
                                // http://cordova.apache.org/docs/en/2.5.0/cordova_camera_camera.md.html#Camera
                            };
                        }
                        else {
                            console.error('please do following command: "cordova plugin add https://github.com/apache/cordova-plugin-camera.git"');
                        }
                    },
                    function notAvailable(){
                    }
                ) ;

            },

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, formController) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, ['mfField']);

                        MFDirectivesHelper.checkOptionalTwoWayDataBindingAttributes(iAttrs, ['mfRequired', 'mfReadonly']);

                        MFDirectivesHelper.checkOptionalBooleanAttributes(iAttrs, ['mfHideLabel'], false);

                        MFDirectivesHelper.checkOptionalStringAttributes(iAttrs, ['mfCssClassContainer', 'mfLabel'], false);

                        scope.mfId = MFDirectivesHelper.calculateId(iAttrs,formController);
                        scope.mfIdInput = scope.mfId+'_input';

                        if (angular.isUndefinedOrNullOrEmpty(scope.mfField.uri)){
                            scope.mfField.uri = _URL_NO_PHOTO_;
                        }

                        //to have access to the actions of the scope builders
                        scope.actions = scope.$parent.actions;

                         //to control and style validation errors
                        scope.getCssError = MFDirectivesHelper.getCssError;
                        scope.showError = MFDirectivesHelper.showError;
                    },

                    post: function postLink(scope, iElement, iAttrs, formController) {
                    }
                };
            }

        };

    }
]);
