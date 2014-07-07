#MFDialogs
This is a module to handle the AngularUI bootstrap modal directive

```
@author Manu de Frutos Vila <manuel.defrutosvila@sopra.com>
@date 20/03/2014
Copyright (c) 2014 Sopra Group. All rights reserved.
```

##Installation
The folder *dialogs* should be under **app** folder. If you are using **html2js** Grunt plugin, you should add the partials in the *build.config.js* app_files json.

In:
```
app_files: {
    js: [ 'src/app/**/*.js'],
    jsunit: [ 'src/test/unit/**/*.js' ],
    tpl: [ 'src/app/partials/*.html'],
    html: [ 'src/index.html' ],
    sass: [ 'src/styles/main.scss' ]
}
```

Either add to the tpl array

``
, 'src/app/dialogs/partials/*.html'
``

or modify it to get all html as template

``
tpl: [ 'src/app/**/*.html'],
``

##Module
At the moment there are two types of Dialogs:

1. Confirm dialog. It has an optional header binded to ``header`` that it is hidden if there is no value binded, a message binded to ``msg`` and by default three buttons:
    1. **No**. It closes the modal with false as parameter, so it can do an action in the main controller and redirect to a route different than *Yes button*.
    2. **Cancel**. Dismisses the modal.
    3. **Yes**. It closes the modal with true as parameter, so it can do an action the in main controller and redirect to a route different than *No button*.
2. Error dialog. It has a header binded to ``header``, and an array of errors binded to ``errors`` with the ng-repeat directive. It has only *Ok button* that closes the modal.

##Controllers

1. ConfirmDialogCtrl.js.
    ```
    @param: {String} header, optional for the caption of the modal.
    @param: {String} msg, the main text of the modal
    @param: {boolean} showNo, to show/hide the No button.
    @param: {boolean} showCancel, to show/hide the Cancel button
    ```

2. ErrorDialogCtrl.js
    ```
    @param: {String} header. A string for the caption of the modal.
    @param: {Array} errors. An array for the list error elements
    ```

##Services

1. DialogsConfig.js. It returns a config json with the name of the controllers and their templates url.

##Partials

1. confirm.html
2. error.html

##Style
In **webapp/src/styles/dialogs.scss** it is defined the styles for the dialogs. The background color danger for error dialog and warning for confirmation dialog.

##Test

To do.

##Example

###A dialog config in your DialogsConfig.js
```javascript
{
	controller : {
		confirm : 'ConfirmDialogCtrl',
		error : 'ErrorDialogCtrl'
	},
	templateUrl : {
		confirm : 'dialogs/partials/confirm.html',
		error: 'dialogs/partials/error.html'
	}
}
```

###A modal open in your main controller
```javascript
var header = config.confirm.header,
	msg = config.confirm.msg,
	showNo = config.showNo,
	showCancel = config.showCancel;

var forgottenModificationsModal = $modal.open({
	templateUrl : DialogsConfig.templateUrl.confirm,
	controller : DialogsConfig.controller.confirm,
	resolve : {
		header : function() { return header; },
		msg : function() { return msg; },
		showNo : function() { return showNo; },
		showCancel : function() { return showCancel; }
	}
});

forgottenModificationsModal.result.then(function (save) {
	//Yes = save; No = go list; Cancel = dismiss modal
	if (!save){
		return $state.go('animal-list');
	}
	$scope.save();
});
```