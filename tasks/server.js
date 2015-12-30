const gulp = require( "gulp" );
const gutil = require( "gulp-util" );
const processHost = require( "processhost" );

gulp.task( "server", () => {
	const processes = processHost();
	processes.start( "server", {
		cwd: "./",
		command: "node",
		args: [ "./tasks/tools/dev-server.js" ],
		stdio: "pipe"
	} );

	let popBrowser = function( data ) {
		if ( /autohost/.test( data.toString() ) ) {
			popBrowser = () => {};
		}
	};

	processes.on( "server.stdout", ev => {
		popBrowser( ev.data );
		gutil.log( `Server: ${ ev.data.toString() }` );
	} );

	processes.on( "server.stderr", ev => {
		gutil.log( gutil.colors.red( `Server: ${ ev.data.toString() }` ) );
	} );
} );
