module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    srcDir: "./src",
    buildDir: "./build",
    appSrcDir: "./appsrc",
    testDir: "./test",
    docDir: "./doc",

    exec: {
      npm_install: {
        cwd: '<%= appSrcDir %>',
        cmd: function () {
          return "npm install";
        }
      }
    },

    watch: {
      build: {
        files: ['<%= srcDir %>/*.jsx'],
        tasks: ['jsx:build']
      },
      test: {
        src: ['<%= srcDir %>/*.jsx', '<%= testDir %>/*.jsx'],
        files: ['<%= testDir %>/*.jsx'],
        tasks: ['jsx:test']
      }
    },

    jsx: {
      build: {
        src: ['<%= srcDir %>/app.jsx'],
        dest: '<%= appSrcDir %>/app.js',
        executable: 'web',
        release: true
      },

      test: {
        src: ['<%= testDir %>/*.jsx'],
        add_search_path: ['<%= srcDir %>'],
        test: true
      },

      doc: {
        src: ['<%= srcDir %>/*.jsx'],
        add_search_path: ['<%= srcDir %>'],
        dest: '<%= docDir %>',
        mode: 'doc'
      }
    },

    nodewebkit: {
      options: {
        build_dir: '<%= buildDir %>', // Where the build version of my node-webkit app is saved
        mac: true,                    // We want to build it for mac
        win: true,                    // We want to build it for win
        linux32: false,               // We don't need linux32
        linux64: false                // We don't need linux64
      },
      src: ['<%= appSrcDir %>/**/*'] // Your node-webkit app
    }
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jsx:build']);
  grunt.registerTask('build', ['exec:npm_install', 'jsx:build', 'nodewebkit']);
  grunt.registerTask('test', ['jsx:test']);
  grunt.registerTask('doc', ['jsx:doc']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
