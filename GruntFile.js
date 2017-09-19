/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// This is the default port that livereload listens on;
// change it if you configure livereload to use another port.
var LIVERELOAD_PORT = 35729;
// lrSnippet is just a function.
// It's a piece of Connect middleware that injects
// a script into the static served html.
var lrSnippet = require('connect-livereload')({
	port: LIVERELOAD_PORT
});
// All the middleware necessary to serve static files.
var livereloadMiddleware = function(connect, options) {
	return [
		// Inject a livereloading script into static files.
		lrSnippet,
		// Serve static files.
		connect.static(options.base[0]),
		// Make empty directories browsable.
		connect.directory(options.base[0])
	];
};

// The first part is the "wrapper" function, which encapsulates your Grunt configuration
module.exports = function(grunt) {

	'use strict';

	// Load grunt tasks automatically
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var plugins = ['karma-mocha'];
	var browsers = [];

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({
		// Next we can read in the project settings from the package.json file into the pkg property. This allows us to refer to the values of properties within our package.json file.
		pkg: grunt.file.readJSON('package.json'),

		// Project settings
		pic: {
			// Configurable paths
			app: 'src',
			dist: 'dist',
			test: 'test'
		},
		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= pic.dist %>/*',
						'!<%= pic.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// sass: {
		//     dist: {
		//         files: {
		//             '<%= pic.dist %>/css/style.min.css': '<%= pic.app %>/css/style.scss'
		//         }
		//     }
		// },

		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//     dist: {
		//         options: {
		//             keepSpecialComments: 0,
		//             report: "min",
		//             selectorsMergeMode: "ie8"
		//         },
		//         files: { // Dictionary of files
		//             '<%= pic.dist %>/css/style.min.css': ['<%= pic.app %>/css/style.css'],
		//             '<%= pic.dist %>/demo/css/style.min.css': ['<%= pic.app %>/demo/css/style.css']
		//         }
		//     }
		// },

		// uglify: {
		//     options: {
		//         // The banner is inserted at the top of the output
		//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		//     },
		//     dist: { // Target
		//         files: { // Dictionary of files
		//             'dist/js/<%= pkg.name %>.min.js': ['src/js/_.config.js', 'src/js/_.main.js', 'src/js/_.helper.js'],
		//             'dist/demo/js/fb.friends.min.js': ['src/demo/js/fb.config.js', 'src/demo/js/fb.friends.list.js'],
		//             'dist/js/libs/jquery.min.js': ['src/js/libs/jquery.js'],
		//             'dist/js/libs/require.min.js': ['src/js/libs/require.js']
		//         }
		//     }
		// },

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			// Define the files to lint
			all: [
				'Gruntfile.js',
				'<%= pic.app %>/js/*.js',
				'<%= pic.app %>/demo/js/*.js'
			],
			// Configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// More options here if you want to override JSHint defaults
				jshintrc: '.jshintrc'
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= pic.app %>/css',
				cssDir: '.tmp/css',
				// generatedImagesDir: '.tmp/images/generated',
				// imagesDir: '<%= pic.app %>/images',
				// javascriptsDir: '<%= pic.app %>/scripts',
				// fontsDir: '<%= pic.app %>/styles/fonts',
				// importPath: '<%= pic.app %>/bower_components',
				// httpImagesPath: '/images',
				// httpGeneratedImagesPath: '/images/generated',
				// httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false
			},
			dist: {
				options: {
					//generatedImagesDir: '<%= pic.dist %>/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: '<%= pic.dist %>'
			},
			//staging: '.tmp',
			html: ['<%= pic.app %>/index.html']
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: ['<%= pic.dist %>']
			},
			html: ['<%= pic.dist %>/{,*/}*.html'],
			css: ['<%= pic.dist %>/css/{,*/}*.css']
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: false,
					removeAttributeQuotes: false,
					removeCommentsFromCDATA: false,
					removeEmptyAttributes: false,
					removeOptionalTags: false,
					removeRedundantAttributes: false,
					useShortDoctype: false
				},
				files: [{
					expand: true,
					cwd: '<%= pic.dist %>',
					src: '{,*/}*.html',
					dest: '<%= pic.dist %>'
				}]
			}
		},

		// Compare CSS output's
		compare_size: {
			files: [
				'<%= pic.app %>/css/**',
				'<%= pic.dist %>/css/**'
			]
		},
		open: {
			server: {
				path: 'http://localhost:9000'
			}

		},
		connect: {
			client: {
				options: {
					// The server's port, and the folder to serve from:
					// Ex: 'localhost:9000' would serve up 'client/index.html'
					port: 9000,
					// change this to '0.0.0.0' to access the server from outside
					hostname: 'localhost',
					base: '<%= pic.app %>',
					// Custom middleware for the HTTP server:
					// The injected JavaScript reloads the page.
					middleware: livereloadMiddleware
				}
			}
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= pic.app %>/scripts/{,*/}*.js', 'Gruntfile.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			client: {
				// '**' is used to include all subdirectories
				// and subdirectories of subdirectories, and so on, recursively.
				files: ['<%= pic.app %>/**/*'],
				// In our case, we don't configure any additional tasks,
				// since livereload is built into the watch task,
				// and since the browser refresh is handled by the snippet.
				// Any other tasks to run (e.g. compile CoffeeScript) go here:
				tasks: [],
				options: {
					livereload: LIVERELOAD_PORT
				}
			},
			compass: {
				files: ['<%= pic.app %>/css/{,*/}*.{scss,sass}'],
				tasks: ['compass:server', 'autoprefixer']
			},
			watch: {
				files: '<%= pic.test %>/unit/**/*.js',
				tasks: ['jasmine']
			}
		},
		notify: {
			task_name: {
				options: {
					// Task-specific options go here.
				}
			},
			watch: {
				options: {
					title: 'Task Complete', // optional
					message: 'SASS and Uglify finished running' //required
				}
			},
			server: {
				options: {
					message: 'Server is ready!'
				}
			},
			connect: {
				options: {
					message: 'Connected to server!'
				}
			}
		},
		// shell: {
		//     docco: {
		//         command: 'docco -o jsdocumentation -l linear src/js/*.js'
		//     }
		// },
		jsdoc: {
			dist: {
				src: ['<%= pic.app %>/js/_.main.js'],
				options: {
					destination: '<%= pic.dist %>/doc'
				}
			}
		},
		// Removed unused css
		uncss: {
			dist: {
				files: {
					'<%= pic.dist %>/css/style.min.css': ['<%= pic.app %>/index.html'],
					'<%= pic.dist %>/demo/css/style.min.css': ['<%= pic.app %>/demo/facebook_friends_list.html']
				}
			},
			options: {
				compress: true,
				report: 'min'
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= pic.app %>',
					dest: '<%= pic.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'images/{,*/}*.webp',
						'{,*/}*.html'
					]
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= pic.app %>/css',
				dest: '.tmp/css/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				'compass:server',
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'compass',
				'copy:styles'
			]
		},
		karma: {
			unit: {
				configFile: 'test/karma.conf.js'
			}
		},
		jasmine: {
			src: 'src/js/*.js',
			options: {
				specs: 'test/unit/**/*.js',
				//helpers: ['src/js/_.config.js'],
				keepRunner: true,
				//host : 'http://127.0.0.1:8000/',
				// summary: true,
				vendor: [
					"src/js/libs/*.js"
					//"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"
				]
			}
			// watch: {
			//     pivotal: {
			//         files: ['<%= pic.app %>/js/*.js','<%= pic.test %>/unit/**/*.js'],
			//         tasks: 'jasmine:pivotal:build'
			//     }
			// }
		},
	});
	//

	/* Don't need to load the individual tasks anymore as we have been using
    'matchdep' task in the start to load all the tasks from node_modules automatically */

	// Let's set up some tasks
	grunt.registerTask('server', [
		'open',
		'connect:client',
		'watch:client',
	]);

	// The default task can be run just by typing "grunt" on the command line
	grunt.registerTask('default', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'jshint',
		'concat',
		'cssmin',
		//'uncss',
		'uglify',
		'copy:dist',
		'usemin',
		'htmlmin',
		//'sass',
		'compare_size',
		'test',
		'notify:server'
	]);


	grunt.registerTask('build-uncss', [
		'default',
		'uncss'
	]);

	// Let's generate the JavaScript documentation
	grunt.registerTask('js-doc', [
		'jsdoc'
	]);

	grunt.registerTask('test', [
		'jshint',
		'jasmine'
	]);

	// To debug the values
	// grunt.event.on('watch', function(action, filepath, target) {
	// grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	// });

};
