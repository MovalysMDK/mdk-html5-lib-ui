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

angular.module('mfui').directive('mfPhoto', ['MFDirectivesHelper', '$modal', 'MFPhotoVMFactory','$timeout',
    function(MFDirectivesHelper, $modal, MFPhotoVMFactory,$timeout) {

        var _URL_NO_PHOTO_ = 'assets/pictures/nophoto.png';

        return {

            restrict: 'E',

            replace: true,

            transclude: false,

            require: '^form',

            scope: {
                mfField: '=',
                mfLabel: '@',
                mfRequired: '=',
                mfReadonly: '=',
                mfHideLabel: '@',
                mfId: '@'
            },

            templateUrl: 'mfui/directives/MfPhoto/MfPhoto.html',

            controller: function controller($scope, $attrs, $element, MFPhotoVMFactory) {
                var photoScope = $scope;

                $element.find('img')[0].addEventListener('click',function(event){
                    if(!$element[0].disabled){
                        event.preventDefault();
                        document.getElementById($scope.mfIdInput).click();
                    }
                    else {
                        $modal.open({
                                        templateUrl: 'mfui/directives/MfPhoto/MfPhotoDetail.html',
                                        controller: ModalInstanceCtrl,
                                        size: 'lg',
                                        resolve: {
                                            photo: function() {
                                                return $scope.mfField;
                                            }
                                        }
                                    });
                    }
                });

                var ModalInstanceCtrl = function ($scope, $modalInstance, photo) {
                    $scope.photoUri = photo.uri;
                    $scope.photoName = photo.name;
                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                };

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

                        scope.getCssClassesContainer = MFDirectivesHelper.getCssClassesContainer(iAttrs.mfCssClassContainer);
                        scope.getCssClassesInputContainer = MFDirectivesHelper.getCssClassesInputContainer(iAttrs);
//                        scope.getCssCursor = function getCssCursor() {
//                            return {
//                                'cursor-pointer': scope.$parent.editMode,
//                                'cursor-not-allowed': !scope.$parent.editMode
//                            };
//                        };

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
