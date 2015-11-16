var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var livereload = require( "gulp-livereload" );
var path = require( "path" );
var fs = require( "fs" );
var config = require( "./server/config" );

var appConfig = global.appConfig = {
	sourceFilePaths: [ "client/js/**/*.+(js|jsx)", "!client/js/coverage/**/*", "!client/js/lib/**/*" ],
	specFilePaths: [ "client/spec/**/*.+(js|jsx)" ],
	serverFilePaths: [ "server/**/*.js", "!server/coverage/**/*" ],
	vendorPaths: [ path.join( __dirname, "./node_modules/**" ), path.join( __dirname, "./client/js/lib/**" ) ],
	root: __dirname,
	theme: "bandit",
	themeOptions: config.client.themeOptions || [ "bandit" ],
	rootUrl: config.rootUrl
};

process.on( "uncaughtException", function( err ) {
	gutil.log( gutil.colors.red( "uncaughtException:", err ) );
} );

var themePath;
var themeSetting = process.env.LK_THEME || argv.theme;
if ( themeSetting ) {
	themePath = path.resolve( __dirname, "./node_modules/@lk/web-common-ui/src/less/themes/" + themeSetting + ".theme.less" );
	if ( fs.existsSync( themePath ) ) {
		appConfig.theme = themeSetting;
	} else {
		throw new Error( "Cannot locate theme named '" + themeSetting + "'" );
	}
}

// load all of the gulp tasks defined in separate files
require( "require-dir" )( "./tasks" );

gulp.task( "default", [ "build" ] );

// Production build
gulp.task( "build", [ "hashes" ] );

// Development Build
gulp.task( "dev", [ "images:copy", "index:dev", "css:dev", "webpack:watch", "webpack:dev", "server" ], function() {
	livereload.listen();
	gulp.watch( [ "client/less/**/*" ], [ "css:dev" ] );
	gulp.watch( [ "public/{css,images}/**/*", "!**/*.less" ] )
		.on( "change", livereload.changed );
	gulp.watch( [ "public/js/**/*" ] )
		.on( "change", _.debounce( livereload.changed, 150 ) );
} );
