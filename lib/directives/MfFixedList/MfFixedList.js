'use strict';
/**
 * Created by Sergio Contreras on 20/05/2014.
 *
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */

/**
 * Directive : mf-fixed-list
 *
 *
 * Mandatory parameters :
 *      # mf-detail-template: url of html template of item detail
 *
 * Optional parameters :
 *      # mf-field      : path to the object in the controller scope mapped with this field
 *      # mf-title-head: title in head of fixed list
 *      # mf-scroll: make the list scrollable
 */

angular.module('mfui').directive('mfFixedList', ['MFDirectivesHelper', '$modal', '$injector', '$compile', 'MFFormModals',

    function(MFDirectivesHelper, $modal, $injector, $compile, MFFormModals) {

        return {
            restrict: 'E',
            scope: true,
            // the scope of this directive is merged with the scope of its parent
            controller: function controller($scope, $attrs, $element) {

                var fixedListScope = $scope;

                // Set type of item to create new objects
                var viewModelTypeFactory = null;
                if (!angular.isUndefined($attrs.mfTypeVmFactory)) {
                    viewModelTypeFactory = $injector.get($attrs.mfTypeVmFactory);
                }

                // Set template url to show item detail.
                var modalTemplateUrl = null;
                if (angular.isUndefined($attrs.mfDetailTemplate)) {
                    console.log('Template must be defined');
                } else {
                    modalTemplateUrl = $attrs.mfDetailTemplate;
                }

                // form name
                var formName = null;
                if (angular.isUndefined($attrs.mfDetailForm)) {
                    console.log('mf-detail-form must be defined');
                } else {
                    formName = $attrs.mfDetailForm;
                }

                // Controller of item detail
                var ModalInstanceCtrl = function($scope, $modalInstance, item) {
                    var modalScope = $scope;
                    modalScope.item = item;
                    modalScope.actions = fixedListScope.actions;

                    modalScope.selected = {
                        item: modalScope.item
                    };

                    modalScope.ok = function() {
                        if ( this[formName].$valid ) {
                            $modalInstance.close(modalScope.selected.item);
                        }
                    };

                    modalScope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                };

                // Method to open item detail
                fixedListScope.open = function(itemSelected, indexSelected) {
                    if(fixedListScope.actions.isInEditionMode()){
                        var flagType = 'new';
                        var item = viewModelTypeFactory.getInstance();
                        // If itemSelected is undefined create a new item
                        if ( angular.isDefined(itemSelected)) {
                            flagType = 'edit';
                            angular.extend(item, itemSelected);
                        }

                        //Open modal and pass the object to show detail
                        var modalInstance = $modal.open({
                            templateUrl: modalTemplateUrl,
                            controller: ModalInstanceCtrl,
                            resolve: {
                                item: function() {
                                    return item;
                                },
                                itemSelected: function() {
                                    return itemSelected;
                                },
                                indexSelected: function() {
                                    return indexSelected;
                                }
                            }
                        });
                        //Promise when modal close with OK or CANCEL
                        modalInstance.result.then(function(selectedItem) {

                            //LMI START
                            if ( flagType === 'new' ) {
                                // item is new, add it to the list
                                $scope.items.push(selectedItem);
                            }
                            else {
                                // item is modified, update the list
                                 $scope.items.splice( indexSelected, 1, selectedItem );
                            }

                        }, function() {

                        });
                    }
                };
                //Delete item of list of items defined in fixed list
                fixedListScope.deleteItem = function(index) {
                    MFFormModals.openRemoveModal('this item').result.then(function() {
                        console.log('delete item with index: ' + index);
                        fixedListScope.items.splice(index, 1);
                    }, function() {

                    });

                };

            },



            compile: function compile(tElement, tAttrs, transclude) {

                var deleteItemTemplate = angular.element(
                    '<div class="delete-item-fixedlist pull-right"><img src="assets/pictures/glyphicons-17-bin.png"  ng-click="deleteItem($index)" ng-readonly="mfReadonly" ng-hide="!actions.isInEditionMode()" style="z-index:9999;"/></div>');
                    //'<div class="delete-item-fixedlist pull-right"><span class="glyphicon glyphicon-trash" ng-click="deleteItem($index)" ng-readonly="mfReadonly" ng-hide="!actions.isInEditionMode()" style="z-index:9999;"></span></div>');

                var openItemTemplate = angular.element('<div ng-click="open(item)"></div>');

                var template = angular.element('<div class="fixedlist-style panel panel-default">' +
                '<div class="panel-heading">' +
                '    <ul class="list-inline">' +
                '         <li>' +
                '              <img src="assets/pictures/glyphicons-433-plus-green.png" ng-click="open()" ng-readonly="mfReadonly" ng-hide="!actions.isInEditionMode()"/>' +
                '           </li>' +
                '           <li>' +
               '               <span>{{headTitle}} ({{items.length}})</span>' +
                '           </li>' +
                '       </ul>' +
                '   </div>' +
                '   <div id="fixed-list-body">' +
               '       <div ng-repeat="item in items track by $index" class="mdk-well fixedlist-item-style">' +
                '       </div>' +
                '   </div>' +
                '</div>');

                var children = tElement.children();

                var repeatElement = angular.element(template.find('div')[2]);
                repeatElement.append(deleteItemTemplate);
                repeatElement.append(openItemTemplate);
                openItemTemplate.append(children);

                tElement.html('');
                tElement.append(template);

                return {
                    pre: function preLink(scope, iElement, iAttrs, ctrl, transclude) {
                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        scope.mfField = iAttrs.mfField;
                        scope.$watch(scope.mfField, function() {
                            var vmList = MFDirectivesHelper.getFieldViewModel(scope.mfField,scope, false);
                            if (!angular.isUndefinedOrNull(vmList)) {
                                scope.items = vmList;
                            }
                        });

                        // Title in head of list
                        if (!angular.isUndefined(iAttrs.mfTitleHead)) {
                            scope.headTitle = iAttrs.mfTitleHead;
                        }
                        console.log('fixedlist scope');
                        console.log(scope);
                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        //Enable scrolling in fixed list container
                        if (!angular.isUndefined(iAttrs.mfScroll)) {
                            //var scrollableBody = iElement.find('#fixed-list-body');
                            //scrollableBody.css('height', document.documentElement.clientHeight / 2);
                            //scrollableBody.css('overflow', 'auto');
                            //scrollableBody.css('-webkit-overflow-scrolling', 'touch');
                        }
                    }
                };
            }
        };

    }
]);
