var gulp = require( "gulp" );
var eslint = require( "gulp-eslint" );
var FileCache = require( "gulp-file-cache" );
var fileCache = new FileCache( ".gulp-lint-cache" );

gulp.task( "lint", function() {
	return gulp.src( [].concat( appConfig.sourceFilePaths ).concat( appConfig.specFilePaths ).concat( appConfig.serverFilePaths ) )
		.pipe( fileCache.filter() )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
		.pipe( fileCache.cache() );
} );
