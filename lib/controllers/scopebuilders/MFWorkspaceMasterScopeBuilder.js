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

angular.module('mfui').factory('MFWorkspaceMasterScopeBuilder', ['$q', '$state', 'MFListScopeBuilder', 'MFUtils',
                                                      function( $q, $state, MFListScopeBuilder, MFUtils) {
    var MFWorkspaceMasterScopeBuilder = function MFWorkspaceMasterScopeBuilder() {};

    var MFWorkspaceActionScopeActions = function MFWorkspaceActionScopeActions($scope) {
        MFWorkspaceActionScopeActions._Parent.call(this, $scope);
    };

    MFUtils.extend(MFWorkspaceActionScopeActions, MFListScopeBuilder.actionsClass);

  MFWorkspaceActionScopeActions.prototype.gotoSelectedDetail = function(stateName, stateParams){
      if(stateName === this.$scope.actions.getLowestDetailState()){
          //to go to the detail of the lowest level, just call "loadDetail" (do not exit the current page but just update the content of the workspace detail)
          this.$scope.$screenScope.actions.loadDetail(stateParams.itemId, stateParams.parentItemId, stateName);
      }
      else {
          this.rootActions.go(stateName, stateParams);
      }
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
