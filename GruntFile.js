module.exports = function(grunt) {

	'use strict';

	// Load grunt tasks automatically
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Project settings
		pic: {
			// Configurable paths
			app: 'src',
			dist: 'dist',
			doc: 'doc',
			test: 'test'
		},
		 uglify: {
		     options: {
		         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		     },
		     dist: {
		         files: {
		             'dist/js/<%= pkg.name %>.min.js': ['src/js/*.js'/*,'node_modules/bertie.vector/dist/js/bertie.vector.js'*/]
		         }
		     },
		     beaut: {
				  options: {
					beautify: true
				  },
		         files: {
		             'dist/js/<%= pkg.name %>.js': ['src/js/*.js'/*,'node_modules/bertie.vector/dist/js/bertie.vector.js'*/]
		         }
		     }
		 },

		jshint: {
			all: [
				'Gruntfile.js',
				'<%= pic.app %>/js/*.js'
			],
			options: {
				'esversion': 6
			}
		},


		jsdoc: {
			dist: {
				src: ['<%= pic.app %>/js/*.js'/*,'node_modules/bertie.vector/<%= pic.app %>/js/*.js'*/],
				options: {
          			configure: './jsdoc.conf.json',
					destination: '<%= pic.doc %>',
					template : "node_modules/ink-docstrap/template"
				}
			}
		},
	});

	// The default task can be run just by typing "grunt" on the command line
	grunt.registerTask('default', [
		'jshint',
		'uglify'
	]);


	// Let's generate the JavaScript documentation
	grunt.registerTask('js-doc', [
		'jsdoc'
	]);

	grunt.registerTask('test', [
		'jshint'
	]);

};
