var reporters = [ "spec" ];

// This isn't part of package JSON
// but will attempt to use it if available
try {
	require( "karma-osx-reporter" ); // eslint-disable-line global-require
	reporters.push( "osx" );
} catch ( e ) {} // eslint-disable-line no-empty

module.exports = function( config ) {
	config.set( {
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [ "mocha" ],

		browserNoActivityTimeout: 60000,

		// list of files / patterns to load in the browser
		files: [
			"client/spec/helpers/karma-setup.js",
			"_spec-tmp/js/test.js"
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"_spec-tmp/js/test.js": [ "sourcemap" ]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: reporters,

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,
		autoWatchBatchDelay: 10,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [ "Chrome" ],

		coverageReporter: {
			reporters: [
				{ type: "html" },
				{ type: "text-summary" }
			],
			dir: "client/coverage/"
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	} );
};
