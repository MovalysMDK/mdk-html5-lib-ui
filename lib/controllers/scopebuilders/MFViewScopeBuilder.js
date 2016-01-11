'use strict';

angular.module('mfui').factory('MFViewScopeBuilder', ['$injector',  '$q',  'MFControllerLauncher', 'MFUtils','snapRemote',
                                                      function( $injector, $q, MFControllerLauncher, MFUtils,snapRemote) {
    var MFViewScopeBuilder = function MFViewScopeBuilder() {};

    var MFViewScopeActions = function MFViewScopeActions($scope) {
        Object.defineProperties(this, {
            $scope: {
                value: $scope,
                writable: false,
                configurable: false,
                enumerable: true
            }
        });
        $scope.rootActions = this.rootActions;
        if (
                this.rootActions &&
                $scope !== this.rootActions.$scope &&
                $scope.viewConfig && // verify that it's not due to the twice call
                $scope.viewConfig.screenConfig !== undefined) {
            this.rootActions.$scope.controlBarEnabled = !$scope.viewConfig.screenConfig.hideControlBar;
            if(this.rootActions.$scope.controlBarEnabled){
                $("#mdk-id-flex-container").removeClass("mdk-reset-control-bar-height");
            }else{
                $("#mdk-id-flex-container").addClass("mdk-reset-control-bar-height");
            }
            this.rootActions.setScreenScope($scope);
        }
    };

    var _rootActions = null;
    Object.defineProperty(MFViewScopeActions.prototype, 'rootActions', {
        get: function () { return _rootActions; },
        set: function (value) { _rootActions = value; },
        configurable: false,
        enumerable: false
    });


    MFViewScopeActions.prototype.init = function(initListener) {
        if (this.$scope.viewConfig !== undefined) {
            console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.viewName), '"$scope.viewConfig.viewName" is required');
            console.assert(this.$scope.viewConfig.isList || this.$scope.viewConfig.canAdd === undefined, '"this.$scope.viewConfig.canAdd" is reserved for lists');
            if (this.$scope.viewConfig.screenConfig !== undefined) {
                console.assert(!angular.isUndefinedOrNull(this.$scope.viewConfig.screenConfig.hideControlBar), '"$scope.viewConfig.screenConfig.hideControlBar" is required');

                if ( this.$scope.viewConfig.screenConfig.exitWithoutSaving === false) {
                    //when not navigable, disable the sliding menu
                    snapRemote.getSnapper().then(function(snapper) {
                        console.log('Sliding menu disabled');
                        snapper.disable();
                    });
                } else {
                    snapRemote.getSnapper().then(function(snapper) {
                        console.log('Sliding menu enabled');
                        snapper.enable();
                    });
                }
            } else {
                console.assert(angular.isUndefinedOrNull(this.$scope.viewConfig.exitState), '"$scope.viewConfig.exitState" is not allowed on $scope.viewConfig; it must be on $scope.viewConfig.screenConfig');
                console.assert(angular.isUndefinedOrNull(this.$scope.viewConfig.exitOnSave), '"$scope.viewConfig.exitOnSave" is not allowed on $scope.viewConfig; it must be on $scope.viewConfig.screenConfig');
                console.assert(angular.isUndefinedOrNull(this.$scope.viewConfig.exitOnCancel), '"$scope.viewConfig.exitOnCancel" is not allowed on $scope.viewConfig; it must be on $scope.viewConfig.screenConfig');
                console.assert(angular.isUndefinedOrNull(this.$scope.viewConfig.hideControlBar), '"$scope.viewConfig.hideControlBar" is not allowed on $scope.viewConfig; it must be on $scope.viewConfig.screenConfig');
                console.assert(angular.isUndefinedOrNull(this.$scope.viewConfig.exitWithoutSaving), '"$scope.viewConfig.exitWithoutSaving" is not allowed on $scope.viewConfig; it must be on $scope.viewConfig.screenConfig');
            }
        }

        return MFControllerLauncher.launch(initListener);
    };

    MFViewScopeBuilder.actionsClass = MFViewScopeActions;
    MFViewScopeBuilder.init = function($scope, initListener) {
        $scope.actions = new MFViewScopeActions($scope);
        return $scope.actions.init(initListener);
    };

    return MFViewScopeBuilder;
}]);
