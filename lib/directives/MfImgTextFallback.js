'use strict';
/**
 * Created by mlaffargue on 2016/01/12.
 *
 * @file MfImgTextFallback.js
 * @brief it replaces an img element with a span element if the image can't be loaded
 * @date 2016/01/12
 *
 * Copyright (c) 2014 Sopra. All rights reserved.
 *
 */


/**
 * Directive : mf-img-text-fallback
 *
 * This directive should be used on IMG tag to add a span if the image loading is in error
 *
 */
angular.module('mfui').directive('mfImgTextFallback', function () {
    function link(scope, element, attrs, ngModelController) {
       element.bind('error', function() {
          var spanToCreate = angular.element("<span class='mdk-img-fallback-text'>" + attrs.mfImgTextFallback + "</span>");
          var spans = element.parent().find("span");
          var fallbackSpan;
          
          for (var i=0 ; !fallbackSpan && i<spans.length ; i++) {
            if (spans[i].className === 'mdk-img-fallback-text') {
              fallbackSpan = spans[i];
            }
          }
          if (fallbackSpan) {
            // Replace the span
            angular.element(fallbackSpan).replaceWith(spanToCreate);
          } else {
            // Add a span
            element.parent().append(spanToCreate);
            // hide the image
            element.css('display', 'none');
          }
      });
      element.bind('load', function() {
          // Image loaded, delete the fallback span if present
          var spans = element.parent().find("span");
          var fallbackSpan;
          
          for (var i=0 ; !fallbackSpan && i<spans.length ; i++) {
            if (spans[i].className === 'mdk-img-fallback-text') {
              fallbackSpan = spans[i];
            }
          }
          if (fallbackSpan) {
            fallbackSpan.remove();
          }
          
          // Remove the display attribute on the img
          if (element.css('display') === 'none') {
            element.css('display','');
          }
      });
    }

    return {
        restrict: 'A',
        link: link
    };

});
