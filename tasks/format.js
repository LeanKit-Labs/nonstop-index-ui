const gulp = require( "gulp" );
const jscs = require( "gulp-jscs" );
const gulpChanged = require( "gulp-changed" );
const FileCache = require( "gulp-file-cache" );
const fileCache = new FileCache( ".gulp-format-cache" );

gulp.task( "format", [ "lint" ], () =>
	gulp.src( [ "*.js", "{client,server,tasks}/**/*.{js,jsx}" ] )
		.pipe( fileCache.filter() )
		.pipe( jscs( {
			configPath: ".jscsrc",
			fix: true
		} ) )
		.pipe( fileCache.cache() )
		.pipe( gulpChanged( ".", { hasChanged: gulpChanged.compareSha1Digest } ) )
		.pipe( gulp.dest( "." ) )
);
