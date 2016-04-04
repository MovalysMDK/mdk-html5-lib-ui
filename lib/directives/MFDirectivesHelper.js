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

angular.module('mfui').factory('MFDirectivesHelper',['MFIntegerConverter', function(MFIntegerConverter) {

    var MFDirectivesHelper = function MFDirectivesHelper() {

    };

    MFDirectivesHelper.prototype.checkMandatoryStringAttributes = function checkMandatoryStringAttributes(attrsObj, attrNames) {
        for (var i = 0; i < attrNames.length; i++) {
            console.assert(!angular.isUndefinedOrNullOrEmpty(attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" is required');
        }
    };

    MFDirectivesHelper.prototype.checkOptionalBooleanAttributes = function checkOptionalBooleanAttributes(attrsObj, attrNames, defaultValueIfNotDefined) {
        var optionalBooleanValue = defaultValueIfNotDefined;
        if(angular.isUndefinedOrNull(defaultValueIfNotDefined)){
            defaultValueIfNotDefined = false;
            optionalBooleanValue = defaultValueIfNotDefined;
        }

        for (var i = 0; i < attrNames.length; i++) {
            if (angular.isUndefined(attrsObj[attrNames[i]])) {
                attrsObj[attrNames[i]] = defaultValueIfNotDefined;
            } else if (attrsObj[attrNames[i]].length === 0) {
                attrsObj[attrNames[i]] = true;
                optionalBooleanValue = true;
            }
            else {
                optionalBooleanValue =  attrsObj[attrNames[i]] = (attrsObj[attrNames[i]] === 'true');
            }
        }
        return optionalBooleanValue;
    };

    MFDirectivesHelper.prototype.checkOptionalStringAttributes = function checkOptionalStringAttributes(attrsObj, attrNames, addSpaces, defaultValue) {
        if(angular.isUndefinedOrNull(defaultValue)){
            defaultValue = '';
        }

        for (var i = 0; i < attrNames.length; i++) {
            if (angular.isUndefinedOrNull(attrsObj[attrNames[i]])) {
                attrsObj[attrNames[i]] = defaultValue;
            } else {
                if (addSpaces) {
                    attrsObj[attrNames[i]] = ' ' + attrsObj[attrNames[i]] + ' ';
                }
            }
        }
    };

    MFDirectivesHelper.prototype.checkOptionalTwoWayDataBindingAttributes = function checkOptionalTwoWayDataBindingAttributes(attrsObj, attrNames) {
        for (var i = 0; i < attrNames.length; i++) {
            console.assert(!angular.isDefinedButNullOrEmpty(attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" is defined but without a required value');
        }
    };

    MFDirectivesHelper.prototype.checkOptionalIntegerAttributes = function checkOptionalIntegerAttributes(attrsObj, attrNames, defaultValue) {
        for (var i = 0; i < attrNames.length; i++) {
            var valueToCheck = attrsObj[attrNames[i]];
            if(angular.isUndefinedOrNullOrEmpty(valueToCheck)){
                attrsObj[attrNames[i]] = defaultValue;
            }
            else {
                attrsObj[attrNames[i]] = MFIntegerConverter.fromString(valueToCheck);
            }
            console.assert(angular.isUndefinedOrNull( attrsObj[attrNames[i]]) || angular.isNumber( attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" must be a number');
        }
    };


    MFDirectivesHelper.prototype.calculateId = function calculateId(attrs, controller) {
        if (angular.isUndefinedOrNullOrEmpty(attrs.mfId)){
            attrs.mfId = '';
            if(!angular.isUndefined(controller)){
                attrs.mfId += controller.$name + '_';
            }
            attrs.mfId +=  attrs.mfField.replace(/\./g, '_');

        }
        return attrs.mfId;
    };


    MFDirectivesHelper.prototype.elementInViewport = function elementInViewport(el) {

        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top >= window.pageYOffset &&
            left >= window.pageXOffset &&
            (top + height) <= (window.pageYOffset + window.innerHeight) &&
            (left + width) <= (window.pageXOffset + window.innerWidth)
            );
    };




    /*
     *  by default the class is "form-group" for the bootstrap styles form validation
     *  but the developer can define an attribute of the directive to add extra css classes
     */
    MFDirectivesHelper.prototype.getCssClassesContainer = function getCssClassesContainer(attrs, scope) {
        if(!angular.isUndefinedOrNull(attrs) && angular.isUndefined(scope.hasLabel)){
            scope.hasLabel = !angular.isUndefinedOrNullOrEmpty(attrs.mfLabel) && !attrs.mfHideLabel;
        }
        scope.mfCssClassContainer = attrs.mfCssClassContainer;

        return function() {
            if (this.hasLabel) {
                return 'form-group ' + this.mfCssClassContainer;
            }
            else {
                return 'form-group '+this.mfCssClassContainer+' form-without-label';
            }
        };
    };

    /*
     * If the directive has not a label, adds an offset to align the grid
     */
    MFDirectivesHelper.prototype.getCssClassesInputContainer = function getCssClassesInputContainer(attrs, scope) {
        if(!angular.isUndefinedOrNull(attrs) && angular.isUndefined(scope.hasLabel)){
            scope.hasLabel = !angular.isUndefinedOrNullOrEmpty(attrs.mfLabel) && !attrs.mfHideLabel;
        }
        return function() {
            if (!this.hasLabel){
                return 'col-sm-offset-2 col-sm-10';
            }
            else {
                return 'col-sm-10';
            }
        };
    };

    MFDirectivesHelper.prototype.getCssError = function getCssError(ngModelController) {
        return {
            'has-success': ngModelController.$valid && ngModelController.$dirty,
            'has-error': ngModelController.$invalid && (ngModelController.$dirty || this.actions.submitted)
        };
    };

    MFDirectivesHelper.prototype.showError = function showError(ngModelController, error) {
        return (ngModelController.$dirty || this.actions.submitted) && ngModelController.$error[error];
    };

    /*
     * Sets a flag to inform the directive that has an optional attribute (usually mf-custom-format, mf-custom-validation)
     * to apply in the input ngModelController
     */
    MFDirectivesHelper.prototype.informOptionalAttributeToNgModelController = function informOptionalAttributeToNgModelController(attribute){
        if (attribute){
            return true;
        }
        return false;
    };

    MFDirectivesHelper.prototype.getFieldViewModel = function getFieldViewModel(mfField, scope, isolatedScope){
        var result;

        if (isolatedScope){
            result = scope.$parent;
        }
        else {
            result = scope;
        }
        var attrArray = mfField.replace('::','').split('.');
        for(var i=0;i<attrArray.length;i++){
            result = result[attrArray[i]];
        }

        return result;
    };
    MFDirectivesHelper.prototype.setFieldViewModel = function setFieldViewModel(value, mfField, scope, isolatedScope){
        var result;

        if (isolatedScope){
            result = scope.$parent;
        }
        else {
            result = scope;
        }
        var attrArray = mfField.split('.');
        for(var i=0;i<attrArray.length;i++){
            if(i === attrArray.length-1){
                result[attrArray[i]] = value;
            }
            else {
                result = result[attrArray[i]];
            }
        }

        return result;
    };

    MFDirectivesHelper.prototype.parseAttributesNameList = function parseAttributesNameList(attributesNameListString){
        var attributesNameList = attributesNameListString.split(',');
        for(var i=0; i<attributesNameList.length; i++) {
            var attrStr = attributesNameList[i];
            attrStr = attrStr.trim();
            attributesNameList[i] = attrStr.split('.');
        }
        return attributesNameList;
    };

    MFDirectivesHelper.prototype.concatAttributesValues = function concatAttributesValues(item, attributesNameList){
        var sContent = '';
        var attrValue;

        for(var i=0; i<attributesNameList.length; i++) {
            attrValue=item[attributesNameList[i][0]];
            for(var j=1; j<attributesNameList[i].length; j++) {
                attrValue=attrValue[attributesNameList[i][j]];
            }
            if (attrValue && attrValue !== null) {
              sContent += attrValue + ' ';
            }
        }
        return sContent;
    };



    return new MFDirectivesHelper();
}]);
