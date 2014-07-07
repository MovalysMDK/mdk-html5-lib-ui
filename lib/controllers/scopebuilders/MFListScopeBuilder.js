'use strict';

angular.module('mfui').factory('MFListScopeBuilder', ['$q',  'MFDataViewScopeBuilder', 'MFUtils',
                                                      function( $q, MFDataViewScopeBuilder, MFUtils) {
    var MFListScopeBuilder = function MFListScopeBuilder() {};

    var MFListScopeActions = function MFListScopeActions($scope) {
        MFListScopeActions._Parent.call(this, $scope);

        var _selectedScopeItem = null;
        Object.defineProperty(this, 'selectedScopeItem', {
            get: function() {
                return _selectedScopeItem;
            },
            set: function(value) {
                _selectedScopeItem = value;
            },
            enumerable: true,
            configurable:false
        });
        this.rootActions.registerListScope($scope);
    };

    MFUtils.extend(MFListScopeActions, MFDataViewScopeBuilder.actionsClass);

    MFListScopeActions.prototype.navigateDetail = function( itemId, parentItemId, scope) {

        if (this.selectedScopeItem === null) {
            this.selectedScopeItem = scope;
        } else {
            this.selectedScopeItem.isSelectedItem = false;
            this.selectedScopeItem = scope;
        }
        this.selectedScopeItem.isSelectedItem = true;

        if (!angular.isUndefinedOrNull(parentItemId)) {
            this.rootActions.go(this.$scope.viewConfig.detailState, { 'itemId': itemId, 'parentItemId': parentItemId });
        } else {
            this.rootActions.go(this.$scope.viewConfig.detailState, { 'itemId': itemId });
        }
    };

    MFListScopeActions.prototype.navigateNew = function() {
        if (!angular.isUndefinedOrNull(this.selectedScopeItem)) {
            this.selectedScopeItem.isSelectedItem = false;
        }
        this.selectedScopeItem = null;
        if (!angular.isUndefinedOrNullOrEmpty(this.$scope.$listScopes[0].viewConfig.groupDetailState)) {
            this.rootActions.go(this.$scope.viewConfig.groupDetailState, { 'itemId': 'new' });
        } else {
            this.rootActions.go(this.$scope.viewConfig.detailState, { 'itemId': 'new' });
        }
    };

    MFListScopeActions.prototype.navigateNewGroup = function(parentItemId) {
        this.rootActions.go(this.$scope.viewConfig.detailState, { 'itemId': 'new', 'parentItemId': parentItemId });
    };

    MFListScopeActions.prototype.isEditable = function() {
        return false;
    };

    MFListScopeActions.prototype.isRemovable = function() {
      return false;
    };

    MFListScopeActions.prototype.isCancelable = function() {
      return false;
    };

    MFListScopeActions.prototype.isInEditionMode = function() {
      return false;
    };

    MFListScopeActions.prototype.init = function(initListener) {
        var deferred = $q.defer();

        this.$scope.viewConfig.isList = true;
        var self = this;
        MFListScopeActions._super.init.call(this, initListener).then(
                function() {
                    console.assert(!angular.isUndefinedOrNull(self.$scope.viewConfig.detailState), '"$scope.viewConfig.detailState" is required in '+self.$scope.viewConfig.viewName);
                    console.assert(!angular.isUndefinedOrNull(self.$scope.viewConfig.searchable), '"$scope.viewConfig.searchable" is required in '+self.$scope.viewConfig.viewName);
                    console.assert(!angular.isUndefinedOrNull(self.$scope.viewConfig.canAdd), '"$scope.viewConfig.canAdd" is required in '+self.$scope.viewConfig.viewName);

                    deferred.resolve();
                },
                function(error) {
                    deferred.reject(error);
                }
        );

        return deferred.promise;
    };


    MFListScopeBuilder.actionsClass = MFListScopeActions;
    MFListScopeBuilder.init = function($scope , initListener) {
        $scope.actions = new MFListScopeActions($scope);
        return $scope.actions.init(initListener);
    };

    return MFListScopeBuilder;
}]);
