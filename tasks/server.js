var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var processHost = require( "processhost" );
var os = require( "os" );

gulp.task( "server", function() {
	var processes = processHost();
	var cmd = /^win/.test( os.platform() ) ? "npm.cmd" : "npm";
	processes.start( "server", {
		cwd: "./",
		command: cmd,
		args: [ "start" ],
		stdio: "pipe"
	} );

	var popBrowser = function( data ) {
		if ( /autohost/.test( data.toString() ) ) {
			popBrowser = function() {};
		}
	};

	processes.on( "server.stdout", function( ev ) {
		popBrowser( ev.data );
		gutil.log( "Server: " + ev.data.toString() );
	} );

	processes.on( "server.stderr", function( ev ) {
		gutil.log( gutil.colors.red( "Server: " + ev.data.toString() ) );
	} );
} );
