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


angular.module('mfui').directive('mfList', ['MFDirectivesHelper', '$timeout','MFActionOnScroll',
    function(MFDirectivesHelper, $timeout,MFActionOnScroll) {

        return {
            scope: true,
            restrict: 'E',
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
                $scope.containerHeight = MFActionOnScroll.htmlElement.clientHeight;
                initItemsDisplayedNb();

                $scope.$watch(function(){
                    return MFActionOnScroll.htmlElement.clientHeight;
                },function(newValue,oldValue){
                    if(newValue !== $scope.containerHeight){
                        $scope.containerHeight = newValue;
                        initItemsDisplayedNb();
                    }
                },true);
//                angular.element(MFActionOnScroll.htmlElement).bind('resize',initItemsDisplayedNb);

//                $scope.$watch('itemsDisplayedInList',function(newValue,oldValue){
//                    console.log('itemsDisplayedInList : '+oldValue+' > '+newValue);
//                });

                // Load more items to DOM when user do 'end scrolling'
                $scope.loadMore = function loadMore() {
                    if (!angular.isUndefinedOrNullOrEmpty($scope.mfField)) {
                        var vmList = MFDirectivesHelper.getFieldViewModel($scope.mfField,$scope, false);
                        if ($scope.itemsDisplayedInList < vmList.length) {
                            console.log('loading: going from '+$scope.itemsDisplayedInList+' items to '+($scope.itemsDisplayedInList+$scope.mfItemsDisplayStep)+' items... (total: '+vmList.length+')');
                            $scope.itemsDisplayedInList = $scope.itemsDisplayedInList + $scope.mfItemsDisplayStep;
                            if($scope.itemsDisplayedInList > vmList.length){
                                $scope.itemsDisplayedInList = vmList.length;
                            }
                        }
                        else {
                            console.log('full list already displayed');
                        }
                    }
                };

                MFActionOnScroll.onScrollDown = $scope.loadMore;

                $scope.$on('$destroy', function() {
                    console.log('MFList directive destroy');
                    MFActionOnScroll.onScrollDown = null;
                });


            },
            compile: function compile(tElement, tAttrs, tTransclude) {

                // Extract the children from this instance of the directive
                var children = tElement.children();
                // Wrap the chidren in our template
                var template = angular.element(
                        '<div mf-perf-scroll >' +
                        '<div mf-suspendable-item ng-repeat="item in items | limitTo:itemsDisplayedInList" class="mflist-item" ng-class="{{ngClass}}">' +
                        '</div>' +
                        '</div>');
                angular.element(template.find('div')[0]).append(children);
                // Append this new template to our compile element
                tElement.html('');
                tElement.append(template);

                return {
                    pre: function preLink(scope, iElement, iAttrs, ctrl, transclude) {

                        MFDirectivesHelper.checkMandatoryStringAttributes(iAttrs, [ 'mfField']);


                        scope.mfField = iAttrs.mfField;
                        scope.ngClass = iAttrs.ngClass;


                        //Default value (navigateDetail) if custom-click is not defined in directive declaration
                        if (angular.isUndefined(iAttrs.mfCustomClick)) {
                            scope.navigateDetail = function(itemId, parentItemId) {
                                scope.actions.navigateDetail(itemId, parentItemId, this);
                            };
                        }

                        scope.addSubItem = function(groupItemId, $event) {
                            $event.stopPropagation();
                            scope.actions.navigateNewGroup(groupItemId);
                        };

                        scope.$watch(scope.mfField, function() {
                            var vmList = MFDirectivesHelper.getFieldViewModel(scope.mfField,scope, false);
                            if (!angular.isUndefinedOrNull(vmList)) {
                                scope.items = vmList;
                            }
                        });

                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {

                    }
                };
            }
        };

    }
]);
