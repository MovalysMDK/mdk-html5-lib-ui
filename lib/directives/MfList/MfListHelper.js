'use strict';

angular.module('mfui').factory('MFListHelper', ['MFCordova', '$window', 'MFSyncPromiseProvider', function (MFCordova, $window, $qSync) {

    var MFListHelper = function MFListHelper() {

    };

    /**
     * @ngdoc method
     * @name MFListHelper#init
     * @function
     *
     * @description
     * This function initializes self.platform and self.navigator
     * using the function MFCordova.OnCordovaReady.
     *
     * @returns {deferred.promise|{then, catch, finally}}
     */
    MFListHelper.prototype.init = function init() {
        var self = this;
        var deferred = $qSync.defer();

        MFCordova.onCordovaReady(
            function available() {
                self.platform = $window.device.platform.toLowerCase();
                self.navigator = '';
                deferred.resolve();
            },
            function notAvailable() {
                self.platform = 'web';
                self.navigator = $window.navigator.userAgent.toLowerCase();
                deferred.resolve();
            }
        );

        return deferred.promise;

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
    MFListHelper.prototype.getTemplate = function getTemplate(tElement, mfSublist) {
        //Extract the children from this instance of the directive
        var parentTemplate, template, ionContentTemplate, ionListTemplate;

        var self = this;
        self.children = tElement.children();

        if (self.platform === 'web' || self.navigator.match(/android/i) ||
            self.platform === 'ios' || self.navigator.match(/iphone/i) ||
            self.platform.match(/windows 8/i) || self.navigator.match(/windows 8/i)) {

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

                if (self.hasMfListChildren()) {
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
                tElement.append(ionContentTemplate);

            }

        } else if (self.platform === 'web') {
            //Desktop
            if (mfSublist) {
                parentTemplate = angular.element('<ul class="mflist-sublist">' +
                    '</ul>');

                template = angular.element(
                    '<li ng-repeat="subitem in item.list"' +
                    'ng-click="navigateDetail([{level:0, id:item.id_id},{level:1,id:subitem.id_id}])"' +
                    '</li>');

                template.append(self.children);


            } else {

                if (self.hasMfListChildren()) {
                    //here we are in the case of list 2D
                    var accordionHeadingTemplate = angular.element('<accordion-heading>' +
                        '</accordion-heading>');
                    accordionHeadingTemplate.append(self.children);
                    var accordionGroupTemplate = angular.element('<accordion-group is-open="isopen">' +
                        '</accordion-group>');
                    accordionGroupTemplate.append(accordionHeadingTemplate);
                    accordionGroupTemplate.append(self.childrenMfList);
                    self.children = accordionGroupTemplate;
                    parentTemplate = angular.element('<accordion close-others="true" class="mflist-2D">' +
                        '</ul>');

                } else {
                    //here we are in the case of list 1D
                    parentTemplate = angular.element('<ul class="mflist-1D">' +
                        '</ul>');
                }
                template = angular.element(
                    '<div mf-perf-scroll mf-infinite-scroll class="list-scroll" >' +
                    '<div mf-suspendable-item ng-repeat="item in items | limitTo:itemsDisplayedInList" class="mflist-item" ng-class="{{ngClass}}">' +
                    '</div>' +
                    '</div>');

                angular.element(template.find('div')[0]).append(self.children);

            }

            parentTemplate.append(template);
            //Append this new template to our compile element
            tElement.html('');
            tElement.append(parentTemplate);
        }

        return tElement;


    };

    /**
     * @ngdoc method
     * @name MFListHelper#hasMfListChildren
     * @function
     *
     * @description
     * The goal is to check if children has a mf-list tag.
     *
     * @returns {boolean}
     */
    MFListHelper.prototype.hasMfListChildren = function(){

        var self = this;
        var result = false;

        //we check here if children get a mf-list tag
        for (var i = 0; i < self.children.length; i++) {
            if (self.children[i].tagName === 'MF-LIST') {
                result = true;
                self.childrenMfList = self.children;
                //we splice the children to extract the sublist from the children.
                //we don't want to process the sublist here.
                self.childrenMfList = self.children.splice(i, 1);
            }
        }

        return result;
    };

    return new MFListHelper();
}]);
