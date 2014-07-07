'use strict';
/**
 * Directive : infinite-scroll
 *
 * This directive allow you to attach an event handler to the element when this element has been scrolled almost to its bottom. In most of the case it will be used for infinite scrolling.
 *
 * Mandatory parameters :
 *      # infinite-scroll   : name of the method to execute when user do end scrolling.
 *
 */

angular.module('mfui').directive('mfInfiniteScroll', ['$timeout','MFActionOnScroll',
    function(timeout, MFActionOnScroll) {
        return {
//            restrict: 'A',
            link: function(scope, element, attr) {

                var promiseScrollDown = null;
                var promiseScrollUp = null;
                var lastRemaining = 9999;

                if(!angular.isUndefinedOrNullOrEmpty(MFActionOnScroll.lengthThreshold)){
                    MFActionOnScroll.lengthThreshold = 50;
                }
                if(!angular.isUndefinedOrNullOrEmpty(MFActionOnScroll.timeThreshold)){
                    MFActionOnScroll.timeThreshold = 400;
                }

                MFActionOnScroll.htmlElement = element[0];


                element.bind('scroll', function () {

                    var remaining = this.scrollHeight - (this.clientHeight + this.scrollTop);

                    //if we have reached the threshold
                    if (remaining < MFActionOnScroll.lengthThreshold) {
                        // when the remaining nb of pixels to display when scrolling is less than "lengthThreshold", call the action to load more


                        if( (remaining - lastRemaining) < 0){

                            //scrolling down
                            if(MFActionOnScroll.onScrollDown !== null) {

                                if (promiseScrollDown === null) { // No call in progress

                                    promiseScrollDown = timeout(
                                        function () {
                                            console.log('scrolling down => call action "MFActionOnScroll.onScrollDown()" to load more');
                                            scope.$eval(MFActionOnScroll.onScrollDown);
                                            promiseScrollDown = null;
                                        }, MFActionOnScroll.timeThreshold
                                    );
                                }
                            }
                        }
                        else {
                            //scrolling up
                            if(MFActionOnScroll.onScrollUp !== null) {

                                if (promiseScrollUp === null) { // No call in progress
                                    promiseScrollUp = timeout(
                                        function () {
                                            console.log('scrolling up => call action "MFActionOnScroll.onScrollUp()" ');
                                            scope.$eval(MFActionOnScroll.onScrollUp);
                                            promiseScrollUp = null;
                                        }, MFActionOnScroll.timeThreshold
                                    );
                                }
                            }
                        }
                    }
                    lastRemaining = remaining;
                });

            }

        };
    }
]);