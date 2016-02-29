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

/**
 * Directive : mf-img-text-fallback
 *
 * This directive should be used on IMG tag to add a span if the image loading is in error
 *
 */
angular.module('mfui').directive('mfImgTextFallback', function () {
    function link(scope, element, attrs, ngModelController) {
       element.bind('error', function() {
          var spanToCreate = angular.element('<span class="mdk-img-fallback-text">' + attrs.mfImgTextFallback + '</span>');
          var spans = element.parent().find('span');
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
          var spans = element.parent().find('span');
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
