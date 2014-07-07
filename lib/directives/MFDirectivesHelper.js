'use strict';

angular.module('mfui').factory('MFDirectivesHelper', function() {

    var MFDirectivesHelper = function MFDirectivesHelper() {

    };

    MFDirectivesHelper.prototype.checkMandatoryStringAttributes = function checkMandatoryStringAttributes(attrsObj, attrNames) {
        for (var i = 0; i < attrNames.length; i++) {
            console.assert(!angular.isUndefinedOrNullOrEmpty(attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" is required');
        }
    };

    MFDirectivesHelper.prototype.checkOptionalBooleanAttributes = function checkOptionalBooleanAttributes(attrsObj, attrNames, defaultValueIfNotDefined) {
        if(angular.isUndefinedOrNull(defaultValueIfNotDefined)){
            defaultValueIfNotDefined = false;
        }

        for (var i = 0; i < attrNames.length; i++) {
            if (angular.isUndefined(attrsObj[attrNames[i]])) {
                attrsObj[attrNames[i]] = defaultValueIfNotDefined;
            } else if (attrsObj[attrNames[i]].length === 0) {
                attrsObj[attrNames[i]] = true;
            }
            else {
                attrsObj[attrNames[i]] = (attrsObj[attrNames[i]] === 'true');
            }
        }
    };

    MFDirectivesHelper.prototype.checkOptionalStringAttributes = function checkOptionalStringAttributes(attrsObj, attrNames, addSpaces) {

        for (var i = 0; i < attrNames.length; i++) {
            if (angular.isUndefinedOrNull(attrsObj[attrNames[i]])) {
                attrsObj[attrNames[i]] = '';
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

    MFDirectivesHelper.prototype.checkValueIsNumber = function checkValueIsNumber(attrsObj, attrNames) {
        for (var i = 0; i < attrNames.length; i++) {
            console.assert(!isNaN(attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" must be a number');
        }
    };

    MFDirectivesHelper.prototype.checkOptionalNumber = function checkOptionalNumber(attrsObj, attrNames) {
        for (var i = 0; i < attrNames.length; i++) {
            console.assert(angular.isUndefinedOrNull(attrsObj[attrNames[i]]) || !isNaN(attrsObj[attrNames[i]]), 'the attribute "' + attrNames[i] + '" must be a number');
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


    // MFDirectivesHelper.prototype.toggleClassError = function toggleClassError(element) {
    //     angular.element(element).addClass('has-error');
    //     angular.element(element).removeClass('has-success');
    // };
    // MFDirectivesHelper.prototype.toggleClassSuccess = function toggleClassSuccess(element) {
    //     angular.element(element).addClass('has-success');
    //     angular.element(element).removeClass('has-error');
    // };
    // MFDirectivesHelper.prototype.clearClass = function clearClass(element) {
    //     angular.element(element).removeClass('has-success');
    //     angular.element(element).removeClass('has-error');
    // };
    // MFDirectivesHelper.prototype.watchInputForErrors = function watchInputForErrors(scope, formController, element) {
    //     var form = scope.$parent[formController.$name];
    //     var input = form[scope.mfId];

    //     if (input.$dirty || scope.$parent.actions.submitted) {
    //         scope.showError = input.$error;
    //         console.log('input.$name: ' + input.$name + ' | input.$invalid: ' + input.$invalid + ' | input.$error: ' + JSON.stringify(input.$error));
    //         if (input.$invalid) {
    //             /*
    //              There is a bug in the thrown error of the component number in angular 2.15 .
    //              We have noticed it while developing mf-integerfield.
    //              $error.number doesn't work correctly. It throws $error.required instead.
    //              $error.required is set to true not only if the field is empty, but also when the field is incorrect
    //              (when $error.number should be true). No other error, even a customed one purposefully in an error
    //              state (ng-pattern) will not be set to true.

    //              This could happen because angular behavior with validations is to not let the user enter wrong values.
    //              For example if the input is type=number and you try to type a letter in the field, angular won't allow it
    //              and will empty the field, firing then the required error because the field is empty.
    //              */
    //             this.toggleClassError(element);
    //         } else {
    //             this.toggleClassSuccess(element);
    //         }
    //     } else {
    //         this.clearClass(element);
    //     }
    //     scope.$apply();
    // };

    // MFDirectivesHelper.prototype.customFormat = function customFormat(scope, attrs, formController, modelValue) {
    //     if (!angular.isUndefined(attrs.mfCustomFormat)) {
    //         var m = scope.mfCustomFormat({
    //             modelValue: modelValue
    //         });
    //         formController[scope.mfId].$setViewValue(m);

    //         if (!angular.isUndefined(attrs.mfCustomValidation)) {
    //             var valid = scope.mfCustomValidation({
    //                 modelValue: modelValue
    //             });
    //             formController[scope.mfId].$invalid = !valid || formController[scope.mfId].$invalid;
    //         }

    //     } else {
    //         return modelValue;
    //     }
    // };

    // MFDirectivesHelper.prototype.customValidation = function customValidation(scope, attrs, formController, viewValue) {
    //     if (!angular.isUndefined(attrs.mfCustomValidation)) {
    //         var valid = scope.mfCustomValidation({
    //             viewValue: viewValue
    //         });
    //         formController[scope.mfId].$invalid = !valid;
    //     }
    //     return viewValue;
    // };

    MFDirectivesHelper.prototype.watchOnChange = function watchOnChange(attrs, scope) {
        if (!angular.isUndefined(attrs.mfOnchange)) {
            var firstTime = true;
            scope.$parent.$watch(attrs.mfField, function(newValue, oldValue) {
                if (!firstTime) {
                    scope.mfOnchange();
                } else {
                    firstTime = false;
                }
            }, true);
        }
    };

    /*
     *  by default the class is "form-group" for the bootstrap styles form validation
     *  but the developer can define an attribute of the directive to add extra css classes
     */
    MFDirectivesHelper.prototype.getCssClassesContainer = function getCssClassesContainer(extraCss) {
        return function() {
            return 'form-group ' + extraCss;
        };
    };

    /*
     * If the directive has not a label, adds an offset to align the grid
     */
    MFDirectivesHelper.prototype.getCssClassesInputContainer = function getCssClassesInputContainer(attrs) {
        return function() {
            if (angular.isUndefinedOrNullOrEmpty(attrs.mfLabel) || attrs.mfHideLabel){
                return 'col-sm-offset-2 col-sm-10';
            }
            return 'col-sm-10';
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
        var attrArray = mfField.split('.');
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
            sContent += attrValue + ' ';
        }
        return sContent;
    };



    return new MFDirectivesHelper();
});
