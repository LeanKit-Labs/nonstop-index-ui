var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var jscs = require( "gulp-jscs" );
var gulpChanged = require( "gulp-changed" );

var FileCache = require( "gulp-file-cache" );
var fileCache = new FileCache( ".gulp-format-cache" );

gulp.task( "format", [ "lint" ], function() {
	return gulp.src( [ "*.js", "{client,server,tasks}/**/*.{js,jsx}" ] )
		.pipe( fileCache.filter() )
		.pipe( jscs( {
			configPath: ".jscsrc",
			fix: true
		} ) )
		.pipe( fileCache.cache() )
		.pipe( gulpChanged( ".", { hasChanged: gulpChanged.compareSha1Digest } ) )
		.pipe( gulp.dest( "." ) );
} );
