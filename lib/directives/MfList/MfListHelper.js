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
