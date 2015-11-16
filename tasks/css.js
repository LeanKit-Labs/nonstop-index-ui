var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var gulpAutoprefixer = require( "gulp-autoprefixer" );
var gulpLess = require( "gulp-less" );
var sourcemaps = require( "gulp-sourcemaps" );

// This works around a strange bug where less would only
// compile the files once during a gulp.watch loop
function resetLess() {
	delete require.cache[ require.resolve( "gulp-less" ) ];
	delete require.cache[ require.resolve( "less" ) ];
	gulpLess = require( "gulp-less" );
}

gulp.task( "css:dev", [ "suitcss:refresh" ], function( done ) {
	resetLess();

	return gulp.src( [ "./client/less/app.less" ] )
		.pipe( sourcemaps.init() )
		.pipe( gulpLess( {
			paths: [],
			globalVars: {
				theme: appConfig.theme
			}
		} ) )
		.on( "error", function( err ) {
			gutil.log( gutil.colors.red( err.message ) );
			done();
		}.bind( this ) )
		.pipe( gulpAutoprefixer( {
			browsers: [ "last 2 versions", "ie >= 9" ],
			cascade: false
		} ) )
		.pipe( sourcemaps.write( { sourceRoot: "/" + appConfig.name + "/source/client/less" } ) )
		.pipe( gulp.dest( "./public/css" ) );
} );

gulp.task( "css:build", [ "suitcss:refresh" ], function( done ) {
	resetLess();

	return gulp.src( [ "./client/less/app.less" ] )
		.pipe( gulpLess( {
			paths: [],
			cleanCss: true,
			globalVars: {
				theme: appConfig.theme
			}
		} ) )
		.on( "error", function( err ) {
			gutil.log( gutil.colors.red( err.message ) );
			done();
		}.bind( this ) )
		.pipe( gulpAutoprefixer( {
			browsers: [ "last 2 versions", "ie >= 9" ],
			cascade: false
		} ) )
		.pipe( gulp.dest( "./public/css" ) );
} );

var gulpFlatten = require( "gulp-flatten" );

gulp.task( "suitcss:refresh", function() {
	return gulp.src( [ "./node_modules/suitcss-*/lib/*.css" ] )
		.pipe( gulpFlatten() )
		.pipe( gulp.dest( "./client/less/suitcss" ) );
} );
