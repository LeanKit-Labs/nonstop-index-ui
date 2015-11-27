var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var livereload = require( "gulp-livereload" );
var path = require( "path" );
var fs = require( "fs" );

require( "./tasks/shared/appConfig" );

process.on( "uncaughtException", function( err ) {
	gutil.log( gutil.colors.red( "uncaughtException:", err ) );
} );

// load all of the gulp tasks defined in separate files
require( "require-dir" )( "./tasks" );

gulp.task( "default", [ "build" ] );

// Production build
gulp.task( "build", [ "hashes" ] );

// Development Build
gulp.task( "dev", [ "images:copy", "index:dev", "css:dev", "format", "server" ], function() {
	livereload.listen();
	gulp.watch( [ "client/less/**/*" ], [ "css:dev" ] );
	gulp.watch( [ "public/{css,images}/**/*", "!**/*.less" ] )
		.on( "change", livereload.changed );
} );
