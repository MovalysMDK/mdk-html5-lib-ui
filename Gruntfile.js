'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    updateBower: {
      main: {
        src: ['lib/**/*.js']
      }
    },

    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        src: [
            'lib/**/*.js'
        ],
        gruntfile: {
            src: './Gruntfile.js'
        }
    },

    sass: {
      main: {
      		options: {
      			loadPath: ['vendor/bootstrap-sass-official/assets/stylesheets','../bootstrap-sass-official/assets/stylesheets']
      		},
		    files: {
			   'build/framework.css': 'assets/styles/framework.scss',
		    }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'jshint',
    'sass',
    'updateBower'
  ]);

  grunt.registerMultiTask('updateBower', 'Update bower.json', function() {
    var bowerFile = 'bower.json';

    var bowerObj = JSON.parse(grunt.file.read(bowerFile));
    bowerObj.main = [];
    bowerObj.main.push('lib/mfuiModule.js');

    this.data.src.forEach(function(pattern) {
      grunt.file.expand(pattern).forEach( function(file) {
        if ( file !== 'lib/mfuiModule.js') {
          bowerObj.main.push(file);
        }
      });
    });

    grunt.file.write(bowerFile, JSON.stringify(bowerObj, null, 2));
  });
};
