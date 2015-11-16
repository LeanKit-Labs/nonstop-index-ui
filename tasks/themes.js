// functionality to support building and saving off all themes for packaging

var gulp = require( "gulp" );
var del = require( "del" );
var runSequence = require( "run-sequence" );

appConfig.themeOptions.forEach( function( theme ) {
	gulp.task( "set-theme-" + theme, function() {
		appConfig.theme = theme;
	} );

	gulp.task( "copy-" + theme, function() {
		return gulp.src( "public/**/*" )
			.pipe( gulp.dest( "themes/" + theme ) );
	} );

	gulp.task( "build-theme-" + theme, function( next ) {
		runSequence( "set-theme-" + theme, "build", "copy-" + theme, "clean-public", next );
	} );
} );

gulp.task( "build-all-themes", [ "clean-public", "clean-themes" ], function( next ) {
	var buildTasks = appConfig.themeOptions.map( function( theme ) {
		return "build-theme-" + theme;
	} );

	// after the build apply the default (first) theme, just in case apply-theme isn't called on destination
	buildTasks.push( "set-theme-" + appConfig.themeOptions[ 0 ], "apply-theme", next );
	runSequence.apply( null, buildTasks );
} );

gulp.task( "clean-public", function() {
	return del( "public/{css,images,js,index.html}" );
} );

gulp.task( "clean-themes", function() {
	return del( "themes" );
} );

gulp.task( "apply-theme", [ "clean-public" ], function() {
	gulp.src( [ "themes/" + appConfig.theme + "/**/*" ] ).pipe( gulp.dest( "public" ) );
} );
