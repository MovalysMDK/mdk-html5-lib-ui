/**
 * MFUpdateVMwithDataLoaderAction
 * Created by Sergio Contreras on 02/04/14.
 */

'use strict';
angular.module('mfui').factory('MFUpdateVMWithDataLoaderAction', ['MFBaseAction',
    function(MFBaseAction) {
        return {
            createInstance: function() {

                var action = MFBaseAction.createInstance({
                    atomic: true,
                    database: false,
                    type: 'MFUpdateVMWithDataLoaderAction'
                });

                /**
                 * Execute operations
                 **/
                action.doAction = function(context, params) {

                    console.log('MFUpdateVMWithDataLoaderAction.doAction');
                    console.log('  dataLoader : ', params.dataLoader);
                    console.log('  viewModelFactory : ', params.viewModelFactory);

                    var that = this;
                    try {
                        var dataLoader = params.dataLoader;
                            var viewModelFactory = params.viewModelFactory;
                            var viewModel = params.viewModel;
                            if(!angular.isUndefinedOrNull(dataLoader)){
                            viewModelFactory.updateViewModelWithDataLoader( viewModel, dataLoader);
                        }
                        that.resolvePromise(viewModel, context);
                    } catch (error) {
                        //Add error message to the context
                        console.error('MFUpdateVMWithDataLoaderAction catch error', error);
                        context.addError('Error while loading data: '+error.message);
                        that.rejectPromise(error, context);
                    }
                    return this;
                };

                return action;
            }

        };

    }
]);