'use strict';

angular.module('mfui').factory('MFListScopeBuilder', ['$q',  'MFDataViewScopeBuilder', 'MFUtils',
                                                      function( $q, MFDataViewScopeBuilder, MFUtils) {
    var MFListScopeBuilder = function MFListScopeBuilder() {};

    var MFListScopeActions = function MFListScopeActions($scope) {
        MFListScopeActions._Parent.call(this, $scope);

        this.rootActions.registerListScope($scope);
    };

    MFUtils.extend(MFListScopeActions, MFDataViewScopeBuilder.actionsClass);

      MFListScopeActions.prototype.getDetailStateByLevel = function(level){

          if(angular.isUndefinedOrNull(this.$scope.viewConfig.detailStatesArray)){
              this.$scope.viewConfig.detailStatesArray = new Array(this.$scope.viewConfig.detail.length);
              for(var i=0;i<this.$scope.viewConfig.detail.length;i++){
                  var currLevel = this.$scope.viewConfig.detail[i];
                  this.$scope.viewConfig.detailStatesArray[currLevel.level] = currLevel.state;
              }
          }
          return this.$scope.viewConfig.detailStatesArray[level];
      };
      MFListScopeActions.prototype.getLowestDetailState = function(){
          if(angular.isUndefinedOrNull(this.$scope.viewConfig.lowestLevelState)){
              this.$scope.viewConfig.lowestLevelState = this.getDetailStateByLevel(this.$scope.viewConfig.detail.length-1);
          }
          return this.$scope.viewConfig.lowestLevelState;
      };


      MFListScopeActions.prototype.canAddToList = function(){
          return this.$scope.viewConfig.canAdd && !angular.isUndefinedOrNullOrEmpty(this.getDetailStateByLevel(0));
      };


      MFListScopeActions.prototype.parseDetailSelectionAndGo = function(levelsSelection){
          levelsSelection = MFUtils.toArray(levelsSelection);

          var totalNbOfLevels = this.$scope.viewConfig.detail.length-1;
          var getStateParamName = function (level){
              var name;
              var nbOfParentToAdd = totalNbOfLevels - level;
              if(nbOfParentToAdd>0){
                  name = 'parent';
                  for(var j=1;j<nbOfParentToAdd;j++){
                      name += 'Parent';
                  }
                  name += 'ItemId';
              }
              else {
                  name = 'itemId';
              }
              return name;
          };


          var stateParams = {};

          var lowestLevelSelected = 0;
          for(var i=0; i< levelsSelection.length;i++){
              if(angular.isUndefinedOrNullOrEmpty(levelsSelection[i].id)){
                  levelsSelection[i].id = 'new';
              }
             stateParams[getStateParamName(levelsSelection[i].level)] = levelsSelection[i].id;
              if(lowestLevelSelected < levelsSelection[i].level){
                  lowestLevelSelected = levelsSelection[i].level;
              }
          }

        var stateName = this.getDetailStateByLevel(lowestLevelSelected);

        if(angular.isUndefinedOrNullOrEmpty(stateName)){
            this.rootActions.showErrorNotification('Detail state not defined for the level no '+lowestLevelSelected+' of this list');
        }
        else {
            this.gotoSelectedDetail(stateName, stateParams);
        }
    };

    MFListScopeActions.prototype.gotoSelectedDetail = function(stateName, stateParams){
        this.rootActions.go(stateName, stateParams);
    };


  //detailSelection: [{level:0,id:2}]  or 2  => go to the screen of the item no 2
    MFListScopeActions.prototype.navigateDetail = function( detailSelection) {
        if(!angular.isUndefinedOrNullOrEmpty(detailSelection)) {
            if(angular.isNumber(detailSelection)){
                this.parseDetailSelectionAndGo([{level:0,id:detailSelection}]);
            }
            else {
                this.parseDetailSelectionAndGo(detailSelection);
            }
        }
        else {
            this.rootActions.showErrorNotification('Cannot navigate to unknown detail');
        }
    };

      //detailSelection: [{level:0,id:2}]  or [{level:0,id:2}, {level:1,id:'new'}]   or   2  => go to the screen to create a child to the item no 2
      MFListScopeActions.prototype.navigateNew = function(detailSelection) {
        if(angular.isUndefinedOrNullOrEmpty(detailSelection)){
            detailSelection = [{level:0,id:'new'}];
        }
        else{
            if(angular.isNumber(detailSelection)){
                detailSelection = [{level:0,id:detailSelection}];
            }

            var lastLevel = detailSelection[detailSelection.length-1];
            if(lastLevel.id !== 'new'){
                detailSelection.push({level:(lastLevel.level+1),id:'new'});
            }
        }
        this.parseDetailSelectionAndGo(detailSelection);
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
                    if(self.$scope.viewConfig.detailState){
                        if(angular.isUndefinedOrNull(self.$scope.viewConfig.detail)){
                            self.$scope.viewConfig.detail = [];
                        }
                        self.$scope.viewConfig.detail.push({
                            level:0,
                            state:self.$scope.viewConfig.detailState
                        });
                    }

                    console.assert(angular.isArray(self.$scope.viewConfig.detail) && self.$scope.viewConfig.detail.length > 0, '"$scope.viewConfig.detailState" or "self.$scope.viewConfig.detail" is required in '+self.$scope.viewConfig.viewName);
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
