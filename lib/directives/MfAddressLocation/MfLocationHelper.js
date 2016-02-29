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

angular.module('mfui').factory('MFLocationHelper', ['$cordovaGeolocation','MFCordova','$window','$q', function($cordovaGeolocation,MFCordova,$window,$q) {

    var MFLocationHelper = function MFLocationHelper() {

    };


    MFLocationHelper.prototype.init = function init(positionObj, mapZoom, label){
        var self = this;
        var deferred = $q.defer();

        MFCordova.onCordovaReady(
            function available(){
                self.platform = $window.device.platform.toLowerCase();
                self.navigator = '';
                deferred.resolve();
            },
            function notAvailable(){
                self.platform = 'web';
                self.navigator = $window.navigator.userAgent.toLowerCase();
                if(!Modernizr.geolocation){
                    deferred.reject('Your browser does not support the HTML5 feature "Geo Localization"');
                }
                deferred.resolve();
            }
        ) ;

        return deferred.promise;

    };

    // Manage differences between browsers platforms to use protocols to call native map app to show position.
    MFLocationHelper.prototype.getPositionURL = function getPositionURL(positionObj, mapZoom, label) {
        var positionMapUrl;

        var self = this;
        if(angular.isUndefinedOrNullOrEmpty(self.platform) || angular.isUndefinedOrNullOrEmpty(positionObj) || angular.isUndefinedOrNullOrEmpty(positionObj.longitude) || angular.isUndefinedOrNullOrEmpty(positionObj.latitude)){
            positionMapUrl= '#';
        }
        else if (self.platform === 'android' || self.navigator.match(/android/i)) {
            positionMapUrl=
            'geo:' + positionObj.latitude + ',' + positionObj.longitude +
            '?q=' + positionObj.latitude + ',' + positionObj.longitude + '(' + encodeURIComponent(label) + ')' +
            '&z=' + mapZoom;

        }
        else if(self.platform === 'ios' || self.navigator.match(/iphone/i)){
            positionMapUrl= 'maps://' +
                               '?q=' + positionObj.latitude + ',' + positionObj.longitude + '' +
                               '&ll=' + positionObj.latitude + ',' + positionObj.longitude +
                               '&z='+ mapZoom;

        }else if(self.platform.match(/windows 8/i) || self.navigator.match(/windows 8/i)){
            //windows Store 8
            positionMapUrl=  'bingmaps:' +
                                '?collection=point.' + positionObj.latitude + '_' + positionObj.longitude +'_'+encodeURIComponent(label)+
                                '&cp=' + positionObj.latitude + '~'+ positionObj.longitude +
                                '&lvl=' + mapZoom;

        }else if (self.platform === 'web') {
            //Desktop
            positionMapUrl= 'http://maps.google.com/maps?' +
                               'q=' + positionObj.latitude + ',' + positionObj.longitude +
                               '&center=' + positionObj.latitude + ',' + positionObj.longitude +
                               '&mapmode=standard' +
                               '&view=map' +
                               '&zoom=' + mapZoom;
        } else {
            positionMapUrl= 'maps://' +
                               'q=' + positionObj.latitude + ',' + positionObj.longitude + '' +
                               '&ll=' + positionObj.latitude + ',' + positionObj.longitude +
                               '&view=map';
        }

        console.info('New position URL: '+positionMapUrl+' ...');

        return positionMapUrl;
    };

    // If cordova is not available this service use html5 geolocation
    MFLocationHelper.prototype.retrievePosition = function retrievePosition(positionObj, position) {
        var self = this;
        console.info('Position found : ',position);
        if(angular.isUndefinedOrNull(position) || !angular.isNumber(position.coords.latitude)  || !angular.isNumber(position.coords.longitude)){
            self.clearFields(positionObj);
        }
        else {
            positionObj.latitude = position.coords.latitude;
            positionObj.longitude = position.coords.longitude;
        }
    };



    MFLocationHelper.prototype.clearFields = function clearFields(positionObj){
        positionObj.longitude = null;
        positionObj.latitude = null;
        positionObj.street = '';
        positionObj.compl = '';
        positionObj.city = '';
        positionObj.country = '';
    };

    MFLocationHelper.prototype.getCurrentPosition = function(positionObj) {
        var deferred = $q.defer();
        var self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position){
                    self.retrievePosition(positionObj, position);
                    deferred.resolve();
                 },
                function(error){
                    console.error(error);
                    self.clearFields(positionObj);
                    deferred.reject();

                }, {
                    enableHighAccuracy: true, timeout : 5000, maximumAge : 0
                }
            );
        }else{
            $cordovaGeolocation.getCurrentPosition().then(
                function(position){
                    self.retrievePosition(positionObj, position);
                    deferred.resolve();
                  },
                  function(error) {
                      console.error(error);
                      self.clearFields(positionObj);
                      deferred.reject();
                  }
            );
        }
        return deferred.promise;
    };
    return new MFLocationHelper();
}]);
