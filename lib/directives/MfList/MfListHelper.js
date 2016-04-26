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

angular.module('mfui').factory('MFListHelper', ['MFCordova', '$window', 'MFSyncPromiseProvider', 'MFDeviceInfo', function (MFCordova, $window, $qSync, MFDeviceInfo) {

    var MFListHelper = function MFListHelper() {

    };

    /**
     * @ngdoc method
     * @name MFListHelper#getTemplate
     * @function
     *
     * @description
     * This function compiles the list template depending of the list depends of the platform. We use ionic list with cordova apps
     * and if cordova is not available (webapp) , we use classic angular list.
     *
     * @param tElement the template to compile
     * @param mfSublist this attribute is set to the second list in the case of a 2D List (accordion list)
     * @returns tElement
     */
    MFListHelper.prototype.getTemplate = function getTemplate(tElement, mfSublist, forceIonic) {
        //Extract the children from this instance of the directive
        var parentTemplate, template, ionContentTemplate, ionListTemplate, self = this, accordionHeadingTemplate, accordionGroupTemplate;
        self.initView(tElement);
        if (/Android|webOS|iPhone|iPad|BlackBerry|Opera Mini/i.test(navigator.userAgent) || forceIonic === 'true' ) {

            //compilation of a ionic list template for cordova apps
            ionListTemplate = angular.element(
                '<ion-list>' +
                '</ion-list>');

            ionContentTemplate = angular.element(
                '<ion-content>' +
                '</ion-content>');

            if (angular.isDefined(mfSublist)) {
                //if mfSublist is definined inside the directive mf-list, we compiles here the
                //template for the sublist, we are in a 2D list (accordion list)
                template = angular.element(
                    '<ion-item ng-repeat="subitem in subitems" class="item-accordion"' +
                    'ng-show="isGroupShown(item)" ng-click="{{mfItemClick}}">' +
                    '</ion-item>');

                template.append(self.children);

                //Append this new template to our compile element
                tElement.html('');
                tElement.append(template);

            } else {

                if (self.hasMfListChildren) {
                    //here we are in the case of list 2D
                    var ngRepeatTemplate = angular.element(
                        '<ion-item class="item-stable" ng-click="toggleGroup(item)"' +
                        'ng-class="{active: isGroupShown(item)}">' +
                        '</ion-item>');

                    ngRepeatTemplate.append(self.children);

                    template = angular.element('<div ng-repeat="item in items">' +
                        '</div>');

                    template.append(ngRepeatTemplate);
                    //we add sublist template to the template which has been processing.
                    template.append(self.childrenMfList);

                } else {
                    //here we are in the case of list 1D
                    template = angular.element(
                        '<ion-item collection-repeat="item in items" class="mflist-item">' +
                        '</ion-item>');

                    template.append(self.children);

                }

                ionListTemplate.append(template);
                ionContentTemplate.append(ionListTemplate);

                //Append this new template to our compile element
                tElement.html('');
                tElement.append(self.floatingButton);
                tElement.append(ionContentTemplate);

            }

        } else {
            //Desktop
            tElement.html('');
            if (mfSublist) {
                template = angular.element(
                    '<div  class="mdk-mflist-2D-child" ng-repeat="subitem in item.list"' +
                    'ng-click="{{mfItemClick}}"' +
                    '</div>');
                template.append(self.children);
                tElement.append(template);
            } else {
                if (self.hasMfListChildren) {
                    //here we are in the case of list 2D
                    accordionHeadingTemplate = angular.element('<accordion-heading class="head">' +
                        '</accordion-heading>');
                    accordionGroupTemplate = angular.element('<accordion-group is-open="isopen">' +
                        '</accordion-group>');
                    accordionHeadingTemplate.append(self.children);
                    accordionGroupTemplate.append(accordionHeadingTemplate);
                    accordionGroupTemplate.append(self.childrenMfList);
                    self.children = accordionGroupTemplate;
                    parentTemplate = angular.element('<accordion mf-perf-scroll mf-infinite-scroll class="mdk-mflist-2D" close-others="true">' +
                        '</div>');
                    template = angular.element(
                        '<div mf-suspendable-item ng-repeat="item in items | limitTo:itemsDisplayedInList" class="mdk-mflist-item-2d" ng-class="{{ngClass}}">' +
                        '</div>');

                } else {
                    //here we are in the case of list 1D
                    parentTemplate = angular.element('<div mf-perf-scroll mf-infinite-scroll class="mdk-mflist-1D">' +
                        '</div>');
                    template = angular.element(
                        '<div mf-suspendable-item ng-repeat="item in items | limitTo:itemsDisplayedInList" class="mdk-mflist-item-1d" ng-class="{{ngClass}}">' +
                        '</div>');

                }
                angular.element(template.append(self.children));
                parentTemplate.append(self.floatingButton);
                parentTemplate.append(template);
                tElement.append(parentTemplate);
            }
        }
        return tElement;


    };
    MFListHelper.prototype.initView = function (tElement) {
        var self = this, dom = tElement.children(), length = dom.length, i = 0;
        self.children = [];
        self.hasMfListChildren = false;
        for (; i < length; i++) {
            if (dom[i].tagName === 'MF-LIST') {
                self.hasMfListChildren = true;
                self.childrenMfList = dom[i];
            } else if ($(dom[i]).hasClass('mdk-floating-button')) {
                self.floatingButton = dom[i];
            } else {
                self.children[i] = dom[i];
            }
        }
    };

    return MFListHelper;
}]);
