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
                            viewModelFactory.updateViewModelWithDataLoader( viewModel, dataLoader, params);
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