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
"use strict";

var gulp = require('gulp'),
    fs = require('fs'),
    through = require('through2'),
    jsonfile = require('jsonfile'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');


gulp.task('jshint', function () {

    return gulp.src('lib/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
    return gulp.src('assets/styles/framework.scss')
        .pipe(sass({includePaths: ['vendor/bootstrap-sass-official/assets/stylesheets','../bootstrap-sass-official/assets/stylesheets']}).on('error', sass.logError))
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

    return gulp.src(['lib/**/*.js', 'assets/styles/css/*.css'])
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

        var x,y;
        var filePath = file.path;

        x = filePath.lastIndexOf('lib');
        y= filePath.lastIndexOf('assets');


        if (x > y && x >= 0) { // Windows-based path
            filePath = filePath.substr(x);
            filePath = filePath.replace(/\\/g, '/');
        } else if(x < y && y >= 0 ){
            filePath = filePath.substr(y);
            filePath = filePath.replace(/\\/g, '/');
        }

        if (filePath !== 'lib/mfuiModule.js') {
            bowerObj.main.push(filePath);
        }
        cb();

    });
}

