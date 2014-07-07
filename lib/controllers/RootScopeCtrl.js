'use strict';

angular.module('mfui').controller('RootScopeCtrl', ['$scope', '$q', 'MFRootScopeBuilder', 'MFResetBaseAction', 'MFLoadFileToSessionStorageAction', 'MFDeleteKeySessionStorageAction', 'MFExportBaseAction', 'MFImportBaseAction', 'MFDataToFileAction', 'MFDataFromFileAction', 'MFActionLauncher', 'snapRemote',
    function($scope, $q, MFRootScopeBuilder, MFResetBaseAction, MFLoadFileToSessionStorageAction, MFDeleteKeySessionStorageAction, MFExportBaseAction, MFImportBaseAction, MFDataToFileAction, MFDataFromFileAction, MFActionLauncher, snapRemote) {
        var params = {
            fileNameExportImport: 'backupBase.json',
            base: {
                sql: {
                    resetDatabase: {
                        keySessionStorage: 'deleteScriptSql',
                        filesPath: [{
                            filePath: 'assets/data/sql/list_fwkmodel.json'
                        }, {
                            filePath: 'assets/data/sql/list_usermodel.json'

                        }]
                    },
                    exportDatabase: {
                        keySessionStorage: 'exportScriptSql',
                        filesPath: [{
                            filePath: 'assets/data/sql/list_fwkmodel.json'
                        }, {
                            filePath: 'assets/data/sql/list_usermodel.json'

                        }]
                    }
                },
                noSql: {
                    resetDatabase: {
                        keySessionStorage: 'deleteScriptNoSql',
                        filesPath: [{
                            filePath: 'assets/data/nosql/list_fwkmodel.json'
                        }, {
                            filePath: 'assets/data/nosql/list_usermodel.json'

                        }]
                    },
                    exportDatabase: {
                        keySessionStorage: 'exportScriptNoSql',
                        filesPath: [{
                            filePath: 'assets/data/nosql/list_fwkmodel.json'
                        }, {
                            filePath: 'assets/data/nosql/list_usermodel.json'

                        }]
                    }
                }
            }
        };

        $scope.resetDatabase = function() {
            var actionsLoadFilesToSession = [];
            var actionResetBase = MFResetBaseAction.createInstance();
            var actionDeleteKeySession = MFDeleteKeySessionStorageAction.createInstance();
            var actionDeleteKeySessionParams = [];

            angular.forEach(params.base, function(value, key) {
                actionsLoadFilesToSession.push({
                    action: MFLoadFileToSessionStorageAction.createInstance(),
                    params: value.resetDatabase
                });
                actionDeleteKeySessionParams.push(value.resetDatabase.keySessionStorage);
            });

            $q.when(true).then(function() {
                //Load Files
                return MFActionLauncher.launchActions(actionsLoadFilesToSession, true);

            }).then(function() {
                return MFActionLauncher.launchAction(actionResetBase, {
                    keySessionStorageSql: params.base.sql.resetDatabase.keySessionStorage,
                    keySessionStorageNoSql: params.base.noSql.resetDatabase.keySessionStorage
                });

            }).then(function() {
                return MFActionLauncher.launchAction(actionDeleteKeySession, {
                    keysSessionStorage: actionDeleteKeySessionParams
                });

            }).then(function() {
                $scope.actions.rootActions.showInfoNotification('database.reset.success');
            }, function(error) {
                $scope.actions.rootActions.showErrorNotification('database.reset.failure',  error.error);
               // console.log(error);
            });
        };

        $scope.exportDatabase = function() {
            var actionsLoadFilesToSession = [];
            var actionExportBase = MFExportBaseAction.createInstance();
            var actionDataToFile = MFDataToFileAction.createInstance();
            var actionDeleteKeySession = MFDeleteKeySessionStorageAction.createInstance();
            var actionDeleteKeySessionParams = [];

            angular.forEach(params.base, function(value, key) {
                actionsLoadFilesToSession.push({
                    action: MFLoadFileToSessionStorageAction.createInstance(),
                    params: value.exportDatabase
                });
                actionDeleteKeySessionParams.push(value.exportDatabase.keySessionStorage);
            });

            $q.when(true).then(function() {
                //Load Files
                return MFActionLauncher.launchActions(actionsLoadFilesToSession, true);

            }).then(function() {
                //Export data
                //console.log('ok pour faire export');
                return MFActionLauncher.launchAction(actionExportBase, {
                    keySessionStorageSql: params.base.sql.exportDatabase.keySessionStorage,
                    keySessionStorageNoSql: params.base.noSql.exportDatabase.keySessionStorage
                });

            }).then(function(value) {
                //Save data in file
                //console.log('Save data in file');
                return MFActionLauncher.launchAction(actionDataToFile, {
                    data: value.result,
                    fileName: params.fileNameExportImport
                });
            }).then(function() {

                return MFActionLauncher.launchAction(actionDeleteKeySession, {
                    keysSessionStorage: actionDeleteKeySessionParams
                });

            }).then(function() {
                $scope.actions.rootActions.showInfoNotification('database.export.success');
            }, function(error) {
                $scope.actions.rootActions.showErrorNotification('database.export.failure', error.error);
            });
        };

        $scope.importDatabase = function() {
            //read file import
            //import base
            var actionDataToFile = MFDataFromFileAction.createInstance();
            var actionImportBase = MFImportBaseAction.createInstance();

            var actionsLoadFilesToSession = [];
            var actionResetBase = MFResetBaseAction.createInstance();
            var actionDeleteKeySession = MFDeleteKeySessionStorageAction.createInstance();
            var actionDeleteKeySessionParams = [];

            angular.forEach(params.base, function(value, key) {
                actionsLoadFilesToSession.push({
                    action: MFLoadFileToSessionStorageAction.createInstance(),
                    params: value.resetDatabase
                });
                actionDeleteKeySessionParams.push(value.resetDatabase.keySessionStorage);
            });

            $q.when(true).then(function() {
                //Load Files
                return MFActionLauncher.launchActions(actionsLoadFilesToSession, true);

            }).then(function() {
                return MFActionLauncher.launchAction(actionResetBase, {
                    keySessionStorageSql: params.base.sql.resetDatabase.keySessionStorage,
                    keySessionStorageNoSql: params.base.noSql.resetDatabase.keySessionStorage
                });

            }).then(function() {
                return MFActionLauncher.launchAction(actionDeleteKeySession, {
                    keysSessionStorage: actionDeleteKeySessionParams
                });

            }).then(function() {
                return MFActionLauncher.launchAction(actionDataToFile, {
                    fileName: params.fileNameExportImport
                });

            }).then(function(value) {
                return MFActionLauncher.launchAction(actionImportBase, {
                    data: value.result
                });

            }).then(function() {
                $scope.actions.rootActions.showInfoNotification('database.import.success');
            }, function(error) {
                //NOK
                $scope.actions.rootActions.showErrorNotification('database.import.failure',  error);
                //console.log(error);
            });
        };
        MFRootScopeBuilder.init($scope);
    }
]);
