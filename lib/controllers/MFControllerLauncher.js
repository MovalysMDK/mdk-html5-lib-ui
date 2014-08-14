'use strict';

angular.module('mfui').factory('MFControllerLauncher',
    [ '$q', 'MFInitScheduler', 'MFInitStatus', 'MFInitEvent', 'cfpLoadingBar',
        function ( $q, MFInitScheduler, MFInitStatus, MFInitEvent, cfpLoadingBar) {
	var MFControllerLauncher = function MFControllerLauncher() {};

    MFControllerLauncher.launch = function(initListener) {
        var deferred = $q.defer();
		var initReady = MFInitScheduler.currentStatus === MFInitStatus.READY;
		if (!initReady && initListener === undefined) {
			cfpLoadingBar.start();
			initListener = function() {
                return false;
            };
		}
		if (initReady) {
            deferred.resolve();
		} else {
			MFInitScheduler.onEvent(function(event) {
				var handleSplashScreen = initListener(event);
				switch (event.type) {
                    case MFInitEvent.Type.START:
                        if (!handleSplashScreen) {
                            cfpLoadingBar.start();
                        }
                        break;
                    case MFInitEvent.Type.TASK_STARTED:
                        break;
                    case MFInitEvent.Type.TASK_SUCCEEDED:
                        break;
                    case MFInitEvent.Type.TASK_FAILED:
                        break;
                    case MFInitEvent.Type.TASK_ABORTED:
                        break;
                    case MFInitEvent.Type.SUCCESS:
                        deferred.resolve();
                        if (!handleSplashScreen) {
                            setTimeout(function() {
                                cfpLoadingBar.complete();
                            }, 0);
                        }
                        break;
                    case MFInitEvent.Type.FAILURE:
                        deferred.reject(event);
                        break;
                    default:
                        console.error('"'+event.type+'" is an unknown init event');
                        deferred.reject(event);
                        break;
                }
			});
		}

        return deferred.promise;
	};

	return MFControllerLauncher;
}]);