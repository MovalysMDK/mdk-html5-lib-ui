'use strict';

angular.module('mfui').factory('MFModalScopeBuilder', ['$q',  'MFDataViewScopeBuilder', 'MFUtils',
    function( $q, MFDataViewScopeBuilder, MFUtils) {
        var MFModalScopeBuilder = function MFModalScopeBuilder() {};

        var MFModalScopeActions = function MFModalScopeActions($scope) {
            Object.defineProperties(this, {
                $scope: {
                    value: $scope,
                    writable: false,
                    configurable: false,
                    enumerable: true
                }
            });

        };



        MFModalScopeActions.prototype.isEditable = function() {
            return false;
        };

        MFModalScopeActions.prototype.isRemovable = function() {
            return false;
        };

        MFModalScopeActions.prototype.isCancelable = function() {
            return false;
        };

        MFModalScopeActions.prototype.isInEditionMode = function() {
            return true;
        };

        MFModalScopeActions.prototype.init = function(initListener) {
            var deferred = $q.defer();

            MFModalScopeActions._super.init.call(this, initListener).then(
                function() {
                    deferred.resolve();
                },
                function(error) {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };


        MFModalScopeBuilder.actionsClass = MFModalScopeActions;
        MFModalScopeBuilder.init = function($scope , initListener) {
            $scope.actions = new MFModalScopeActions($scope);
            return true;
        };

        return MFModalScopeBuilder;
    }]);
