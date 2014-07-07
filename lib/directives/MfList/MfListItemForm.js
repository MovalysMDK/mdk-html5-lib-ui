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