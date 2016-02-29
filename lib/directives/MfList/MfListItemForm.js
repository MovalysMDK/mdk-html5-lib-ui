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

angular.module('mfui').directive('mfListItemForm',
    function() {
        return {
            scope: {
                mfFormNamePrefix: '@',
                mfListItemForm:'='
            },
            link: function (scope, element, attrs) {
                var formName='';

                if(!angular.isUndefinedOrNullOrEmpty(scope.mfFormNamePrefix)) {
                    formName = scope.mfFormNamePrefix;
                }

                if(angular.isArray(scope.mfListItemForm)){
                    for(var i=0;i<scope.mfListItemForm.length;i++){
                        formName+='_'+scope.mfListItemForm[i];
                    }
                }
                else {
                    formName+='_'+scope.mfListItemForm;
                }
                element.attr('id',formName);
                element.attr('name',formName);
            }
        };
    }
);