module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    sampleDir: "samples",
    buildDir: "bin",
    libDir: "lib",
    testDir: "test",
    docDir: "doc",

    watch: {
      jsxinit: {
        files: ['<%= srcDir %>/*.jsx', '<%= libDir %>/*.jsx'],
        tasks: ['jsx:build']
      },
      test: {
        files: ['<%= testDir %>/*.jsx'],
        tasks: ['jsx:test']
      }
    },

    jsx: {
      build: {
        src: ['<%= sampleDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>'],
        dest: '<%= sampleDir %>/',
      },

      test: {
        src: ['<%= testDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>'],
        test: true
      },

      doc: {
        src: ['<%= libDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>'],
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

  grunt.registerTask('build', ['jsx:buildsample']);
  grunt.registerTask('test', ['jsx_test:runtest']);
  grunt.registerTask('doc', ['jsx_doc:apidoc']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
