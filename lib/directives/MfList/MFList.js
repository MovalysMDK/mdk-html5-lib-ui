'use strict';
/**
 * Created by Sergio Contreras on 28/04/2014.
 *
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */

/**
 * Directive : mf-list
 *
 *
 * Optional parameters :
 *
 *      # mf-field              : path to the object in the controller scope mapped with this field
 *      # mf-custom-click(?)    : method to call when user click in item of the list
 *      # mf-items-display-step : number of additional items to display when scrolling down
 *      # mf-row-height         : number of pixels for one row
 *      # ng-class
 */


angular.module('mfui').directive('mfList', ['MFDirectivesHelper', '$timeout','MFActionOnScroll','$templateCache','$window','MFListHelper',
    function(MFDirectivesHelper, $timeout,MFActionOnScroll, $templateCache, $window, MFListHelper) {

        return {
            scope: true,
            restrict: 'E',
            transclude: false,
            controller: function controller($scope, $attrs, $element) {

                MFDirectivesHelper.checkOptionalIntegerAttributes($attrs, ['mfItemsDisplayStep'], 2);
                $scope.mfItemsDisplayStep = $attrs.mfItemsDisplayStep;

                MFDirectivesHelper.checkOptionalIntegerAttributes($attrs, ['mfRowHeight'], 45);
                $scope.mfRowHeight = $attrs.mfRowHeight;

                $scope.itemsDisplayedInList = 0;

                var initItemsDisplayedNb = function initItemsDisplayedNb(){
                    $scope.itemsDisplayedInList = Math.round($scope.containerHeight/$scope.mfRowHeight)+$scope.mfItemsDisplayStep;
                    console.debug('Container height:'+$scope.containerHeight+' - row height:'+$scope.mfRowHeight+' - ratio:'+Math.round($scope.containerHeight/$scope.mfRowHeight));
                    console.debug('Number of items to display when list is loaded: '+$scope.itemsDisplayedInList);
                };

                $scope.containerHeight = 800;//MFActionOnScroll.htmlElement.clientHeight;


                initItemsDisplayedNb();


                $scope.$watch(function(){

                    return 800; //MFActionOnScroll.htmlElement.clientHeight;


                },function(newValue,oldValue){
                    if(newValue !== $scope.containerHeight){
                        $scope.containerHeight = newValue;
                        initItemsDisplayedNb();
                    }
                },true);

                if(angular.isUndefinedOrNull($attrs.mfSublist)) {
                    // Load more items to DOM when user do 'end scrolling'
                    $scope.loadMore = function loadMore() {
                        if (!angular.isUndefinedOrNullOrEmpty($scope.mfField)) {
                            var vmList = MFDirectivesHelper.getFieldViewModel($scope.mfField, $scope, false);
                            if ($scope.itemsDisplayedInList < vmList.length) {
                                console.log('loading: going from ' + $scope.itemsDisplayedInList + ' items to ' + ($scope.itemsDisplayedInList + $scope.mfItemsDisplayStep) + ' items... (total: ' + vmList.length + ')');
                                $scope.itemsDisplayedInList = $scope.itemsDisplayedInList + $scope.mfItemsDisplayStep;
                                if ($scope.itemsDisplayedInList > vmList.length) {
                                    $scope.itemsDisplayedInList = vmList.length;
                                }
                            }
                            else {
                                console.log('full list already displayed');
                            }
                        }
                    };

                    MFActionOnScroll.onScrollDown = $scope.loadMore;
                }

                $scope.$on('$destroy', function() {
                    console.log('MFList directive destroy');
                    MFActionOnScroll.onScrollDown = null;
                });

                $scope.getCssWithControlbar = function() {
                    return {
                        'snapWithMargin': this.controlBarEnabled,
                        'snapWithoutMargin': !this.controlBarEnabled
                    };
                };

            },

            compile: function compile(tElement, tAttrs, tTransclude) {

                MFListHelper.init().then(
                    function(){
                        tElement = MFListHelper.getTemplate(tElement,tAttrs.mfSublist);
                    },
                    function (error){
                        //scope.actions.rootActions.showErrorNotification(error);

                    }
                );

                return {

                    pre: function preLink(scope, iElement, iAttrs, ctrl, transclude) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);

                        scope.mfField = iAttrs.mfField;
                        scope.ngClass = iAttrs.ngClass;
                        scope.mfItemClick = iAttrs.mfItemClick;


                        //Default value (navigateDetail) if custom-click is not defined in directive declaration
                        if (angular.isUndefined(iAttrs.mfCustomClick)) {
                            scope.navigateDetail = function(detailSelection) {
                                event.preventDefault();

                                //revert style of the previous selected item
                                scope.actions.clearItemSelection();

                                // change style of the new selected item
                                scope.selectItem(this);

                                scope.actions.navigateDetail(detailSelection);
                            };
                        }

                        scope.actions.clearItemSelection = function(){
                            if(!angular.isUndefinedOrNullOrEmpty(scope.selectedItemScope)){
                                scope.selectedItemScope.isSelectedItem = false;
                                scope.selectedItemScope = null;
                            }
                        };

                        scope.selectItem = function(itemScope){
                            itemScope.isSelectedItem = true;
                            scope.selectedItemScope = itemScope;
                        };

                        scope.addSubItem = function(detailSelection, $event) {
                            $event.stopPropagation();
                            event.preventDefault();
                            scope.actions.clearItemSelection();
                            scope.actions.navigateNew(detailSelection);
                        };

                        scope.toggleGroup = function(group){
                            if(scope.isGroupShown(group)){
                                scope.shownGroup = null;
                            } else{
                                scope.shownGroup = group;
                            }
                        };

                        scope.isGroupShown = function(group){
                            return scope.shownGroup === group;
                        };

                        scope.$watch(scope.mfField, function() {
                            var vmList = MFDirectivesHelper.getFieldViewModel(scope.mfField,scope, false);
                            if (!angular.isUndefinedOrNull(vmList)) {
                                if(angular.isDefined(iAttrs.mfSublist)){
                                    scope.subitems = vmList;
                                } else{
                                    scope.items = vmList;
                                }

                            }
                        });




                    },
                    post: function postLink(scope, iElement, iAttrs, controller, transclude) {

                    }
                };
            }
        };



    }

]);
