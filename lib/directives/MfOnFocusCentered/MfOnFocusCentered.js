angular
    .module('mfui')
    .directive('mfOnFocusCentered', mfOnFocusCentered);

function mfOnFocusCentered() {
    var loopInstance;
    var mdkRequestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;
    var mdkCancelAnimationFrame = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame;
    return {
        restrict: 'A',
        link: function (scope, element) {
            document.addEventListener('deviceready', function () {
                if (device && device.platform === 'Android') {
                    element.on('focusin', onFocusCenterRegister);
                    element.on('focusout', onFocusCenterUnRegister);
                }
            }, false);
        }
    };

    function onFocusCenterRegister() {
        window.addEventListener('native.keyboardshow', onFocusCenter, false);
    }

    function onFocusCenterUnRegister() {
        window.removeEventListener('native.keyboardshow', onFocusCenter, false);
    }

    function onFocusCenter() {
        onFocusCenterUnRegister();
        setTimeout(function () {
            var center = angular.element(window).height() / 2;
            var selectedElement = angular.element(document.activeElement);
            var scrollElement = angular.element('body > #mdk-scroll-zone');
            var position = scrollElement.scrollTop();
            var top = selectedElement.offset().top + position;
            if (top > center) {
                scrollToTop(top + (selectedElement.height() / 2) - center, 200, scrollElement, position);
            } else {
                scrollToTop(0, 200, scrollElement, position);
            }
        }, 50);
    }

    function scrollToTop(endPoint, scrollDuration, scrollElement, startPoint) {
        var startTime;
        var delta = Math.abs(endPoint - startPoint);
        if (mdkRequestAnimationFrame) {
            if (mdkCancelAnimationFrame) {
                mdkCancelAnimationFrame(loopInstance);
            }
            if (endPoint > startPoint) {
                loopInstance = mdkRequestAnimationFrame(stepUp);
            } else {
                loopInstance = mdkRequestAnimationFrame(stepDown);
            }
        } else {
            scrollElement.scrollTop(startPoint + delta);
        }
        function stepUp(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            var ratio = (timestamp - startTime) / scrollDuration;
            if (ratio < 1) {
                scrollElement.scrollTop(startPoint + easeInOutQuart(ratio) * delta);
                mdkRequestAnimationFrame(stepUp);
            } else {
                scrollElement.scrollTop(startPoint + delta);
            }
        }

        function stepDown(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            var ratio = (timestamp - startTime) / scrollDuration;
            if (ratio < 1) {
                scrollElement.scrollTop(startPoint - easeInOutQuart(ratio) * delta);
                mdkRequestAnimationFrame(stepDown);
            } else {
                scrollElement.scrollTop(startPoint - delta);
            }
        }
    }

    function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    }
}