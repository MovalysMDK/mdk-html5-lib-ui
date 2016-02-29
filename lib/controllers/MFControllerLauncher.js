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