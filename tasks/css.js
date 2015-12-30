const gulp = require( "gulp" );
const gutil = require( "gulp-util" );
const gulpAutoprefixer = require( "gulp-autoprefixer" );
const sourcemaps = require( "gulp-sourcemaps" );
const gulpFlatten = require( "gulp-flatten" );
let gulpLess = require( "gulp-less" );

// This works around a strange bug where less would only
// compile the files once during a gulp.watch loop
function resetLess() {
	delete require.cache[ require.resolve( "gulp-less" ) ];
	delete require.cache[ require.resolve( "less" ) ];
	gulpLess = require( "gulp-less" ); // eslint-disable-line global-require
}

gulp.task( "css:dev", [ "suitcss:refresh" ], done => {
	resetLess();

	return gulp.src( [ "./client/less/app.less" ] )
		.pipe( sourcemaps.init() )
		.pipe( gulpLess( {
			paths: [ "node_modules" ],
			globalVars: {
				theme: appConfig.theme
			}
		} ) )
		.on( "error", err => {
			gutil.log( gutil.colors.red( err.message ) );
			done();
		} )
		.pipe( gulpAutoprefixer( {
			browsers: [ "last 2 versions", "ie >= 9" ],
			cascade: false
		} ) )
		.pipe( sourcemaps.write( { sourceRoot: `/${ appConfig.name }/source/client/less` } ) )
		.pipe( gulp.dest( "./public/css" ) );
} );

gulp.task( "css:build", [ "suitcss:refresh" ], done => {
	resetLess();

	return gulp.src( [ "./client/less/app.less" ] )
		.pipe( gulpLess( {
			paths: [ "node_modules" ],
			cleanCss: true,
			globalVars: {
				theme: appConfig.theme
			}
		} ) )
		.on( "error", err => {
			gutil.log( gutil.colors.red( err.message ) );
			done();
		} )
		.pipe( gulpAutoprefixer( {
			browsers: [ "last 2 versions", "ie >= 9" ],
			cascade: false
		} ) )
		.pipe( gulp.dest( "./public/css" ) );
} );

gulp.task( "suitcss:refresh", () =>
	gulp.src( [ "./node_modules/suitcss-*/lib/*.css" ] )
		.pipe( gulpFlatten() )
		.pipe( gulp.dest( "./client/less/suitcss" ) )
);
