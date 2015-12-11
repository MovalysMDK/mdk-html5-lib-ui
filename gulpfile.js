"use strict";

var gulp = require('gulp'),
    fs = require('fs'),
    through = require('through2'),
    jsonfile = require('jsonfile'),
    sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');


gulp.task('jshint', function () {

    return gulp.src('lib/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
    return sass('assets/styles/framework.scss',
        {loadPath : ['vendor/bootstrap-sass-official/assets/stylesheets','../bootstrap-sass-official/assets/stylesheets']})
        .on('error', sass.logError)
        .pipe(rename('framework.css'))
        .pipe(gulp.dest('build/'));
});


/**
 * Default task, if no parameter given
 */
gulp.task('default', ['jshint', 'sass', 'updateBower']);

/**
 * update the bower.json adding all the js files present in the project.
 */
gulp.task('updateBower', function () {
    var bowerFile = 'bower.json';

    try {
        var bowerObj = JSON.parse(fs.readFileSync(bowerFile).toString());
    } catch(e){
        gutil.log(gutil.colors.red('bower.json Parsing error : ', e));
    }
    bowerObj.main = [];
    bowerObj.main.push('lib/mfuiModule.js');

    return gulp.src('lib/**/*.js')
        .pipe(feedBowerObj(bowerObj))
        .on('end', function(){
            jsonfile.spaces = 2;
            jsonfile.writeFile(bowerFile, bowerObj);
        });

});

/**
 *
 * @param bowerObj
 *
 * feed bowerObj with all the js files present in the project
 */
function feedBowerObj(bowerObj) {
    return through.obj(function (file, enc, cb) {

        var x;
        var filePath = file.path;

        x = filePath.lastIndexOf('lib');
        if (x >= 0) { // Windows-based path
            filePath = filePath.substr(x);
            filePath = filePath.replace(/\\/g, '/');
        }
        if (filePath !== 'lib/mfuiModule.js') {
            bowerObj.main.push(filePath);
        }
        cb();

    });
}

