var cp = require('child_process');
var buildConfig = require('./config/build');

module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      lib: [
        'dist'
      ]
    },

    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: buildConfig.mdkHtml5UIFiles,
        dest: 'dist/js/mdk-html5-ui.js'
      },
      bundle: {
        options: {
          banner:
            '/*!\n' +
            ' * mdk-html5-ui.bundle.js is a concatenation of:\n' +
            ' * mdk-html5-ui.js, mdk-html5-core.js, angular.js\n'+
            ' */\n\n'
        },
        src: [
          'dist/js/mdk-html5-ui.js',
          'dist/js/mdk-html5-core.js',
          'vendor/angular/angular.js'
        ],
        dest: 'dist/js/mdk-html5-ui.bundle.js'
      },
      bundlemin: {
        options: {
          banner: '<%= concat.bundle.options.banner %>'
        },
        src: [
          'dist/js/mdk-html5-core.min.js',
          'dist/js/mdk-html5-ui.min.js',
          'vendor/angular/angular.min.js'
        ],
        dest: 'dist/js/mdk-html5-ui.bundle.min.js'
      }
    },

    version: {
      dist: {
        dest: 'dist/version.json'
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: './vendor',
          src: buildConfig.vendorFiles,
          dest: './dist/js/'
        }]
      }
    },

    //Used by CI to check for temporary test code
    //xit, iit, ddescribe, xdescribe
    'ddescribe-iit': ['src/lib/**/*.js'],
    'merge-conflict': ['src/lib/**/*.js'],

    'removelogging': {
      dist: {
        files: [{
          expand: true,
          cwd: './dist/js',
          src: ['*.js'],
          dest: 'dist/js/'
        }],
        options: {
          methods: 'log info assert count clear group groupEnd groupCollapsed trace debug dir dirxml profile profileEnd time timeEnd timeStamp table exception'.split(' ')
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/lib/**/*.js', 'src/test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/mdk-html5-ui.min.js': 'dist/js/mdk-html5-ui.js'
        }
      },
      options: {
        preserveComments: 'some'
      }
    },

    sass: {
      dist: {
        files: {
          'dist/css/mdk-html5-ui.css': 'src/scss/mdk-html5-ui.scss',
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/mdk-html5-ui.min.css': 'dist/css/mdk-html5-ui.css',
        }
      }
    },

    'string-replace': {
      version: {
        files: {
          'dist/js/mdk-html5-ui.js': 'dist/js/mdk-html5-ui.js',
          'dist/css/mdk-html5-ui.css': 'dist/css/mdk-html5-ui.css'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    },

    bump: {
     options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        push: false
      }
    },

    watch: {
      scripts: {
        files: ['src/lib/**/*.js'],
        tasks: ['concat:dist', 'concat:bundle'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      }
    },

    pkg: grunt.file.readJSON('package.json')
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);

  //NOTE(ajoslin): the order of these tasks is very important.
  grunt.registerTask('build', [
    'clean:lib',
    'concat:dist',
    'copy',
    'string-replace',
    'version',
    'cssmin',
    'concat:bundle',
    'removelogging',
    'uglify',
    'concat:bundlemin'
  ]);

  grunt.registerMultiTask('version', 'Generate version JSON', function() {
    var pkg = grunt.config('pkg');
    this.files.forEach(function(file) {
      var dest = file.dest;
      var d = new Date();
      var version = {
        version: pkg.version,
        codename: pkg.codename,
        date: grunt.template.today('yyyy-mm-dd'),
        time: d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds()
      };
      grunt.file.write(dest, JSON.stringify(version, null, 2));
    });
  });
};
