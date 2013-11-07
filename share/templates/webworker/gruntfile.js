module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    srcDir: "src",
    sampleDir: "sample",
    buildDir: "dest/src",
    libDir: "lib",
    testDir: "test",
    docDir: "doc",

    watch: {
      build: {
        files: ['<%= srcDir %>/*.jsx', '<%= libDir %>/*.jsx'],
        tasks: ['jsx:build']
      },
      test: {
        src: ['<%= libDir %>/*.jsx', '<%= srcDir %>/*.jsx', '<%= testDir %>/*.jsx'],
        files: ['<%= testDir %>/*.jsx'],
        tasks: ['jsx:test']
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: 'dest',
          keepalive: true
        }
      }
    },

    jsx: {
      build: {
        src: ['<%= srcDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>', 'node_modules/*/lib'],
        dest: '<%= buildDir %>/',
        linker: 'webworker',
        release: true
      },

      sample: {
        src: ['<%= sampleDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>', 'node_modules/*/src'],
        dest: '<%= buildDir %>/',
        executable: 'web',
        release: true
      },

      test: {
        src: ['<%= testDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>', '<%= srcDir %>', 'node_modules/*/src'],
        test: true
      },

      doc: {
        src: ['<%= libDir %>/*.jsx', '<%= srcDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>', '<%= srcDir %>', 'node_modules/*/src'],
        dest: '<%= docDir %>',
        mode: 'doc'
      }
    }
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jsx:build', 'jsx:sample']);
  grunt.registerTask('build', ['jsx:build', 'jsx:sample']);
  grunt.registerTask('test', ['jsx:test']);
  grunt.registerTask('doc', ['jsx:doc']);
  grunt.registerTask('runserver', ['connect:server']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
