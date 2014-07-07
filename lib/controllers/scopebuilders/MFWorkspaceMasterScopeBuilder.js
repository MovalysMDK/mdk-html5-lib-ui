'use strict';

angular.module('mfui').factory('MFWorkspaceMasterScopeBuilder', ['$q', '$state', 'MFListScopeBuilder', 'MFUtils',
                                                      function( $q, $state, MFListScopeBuilder, MFUtils) {
    var MFWorkspaceMasterScopeBuilder = function MFWorkspaceMasterScopeBuilder() {};

    var MFWorkspaceActionScopeActions = function MFWorkspaceActionScopeActions($scope) {
        MFWorkspaceActionScopeActions._Parent.call(this, $scope);
    };

    MFUtils.extend(MFWorkspaceActionScopeActions, MFListScopeBuilder.actionsClass);

    MFWorkspaceActionScopeActions.prototype.navigateDetail = function( itemId, parentItemId, scope ) {
        if (this.selectedScopeItem === null) {
            this.selectedScopeItem = scope;
        } else {
            this.selectedScopeItem.isSelectedItem = false;
            this.selectedScopeItem = scope;
        }
        this.selectedScopeItem.isSelectedItem = true;

        this.$scope.$screenScope.actions.loadDetail(itemId, parentItemId, this.$scope.viewConfig.detailState);

    };

  MFWorkspaceActionScopeActions.prototype.navigateNew = function() {
      this.$scope.$screenScope.actions.loadDetail('new', 'new',this.$scope.viewConfig.detailState);
  };

  MFWorkspaceActionScopeActions.prototype.navigateNewGroup = function(parentItemId) {
      this.$scope.$screenScope.actions.loadDetail('new', parentItemId,this.$scope.viewConfig.detailState);
    };

     MFWorkspaceActionScopeActions.prototype.init = function(initListener) {
         this.$scope.viewConfig.isWorkspacePanel = true;
        return MFWorkspaceActionScopeActions._super.init.call(this, initListener);
    };


    MFWorkspaceMasterScopeBuilder.actionsClass = MFWorkspaceActionScopeActions;
    MFWorkspaceMasterScopeBuilder.init = function($scope , initListener) {
        $scope.actions = new MFWorkspaceActionScopeActions($scope);

        return $scope.actions.init(initListener);
    };

    return MFWorkspaceMasterScopeBuilder;
}]);
