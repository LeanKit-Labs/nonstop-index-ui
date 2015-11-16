var gulp = require( "gulp" );
var gutil = require( "gulp-util" );
var _ = require( "lodash" );
var webpack = require( "webpack" );
var gulpWebpack = require( "webpack-stream" );
var webpackConfig = require( "./webpack/build.config.js" );
var webpackDevConfig = require( "./webpack/dev.config.js" );
var webpackTestConfig = require( "./webpack/test.config.js" );
var webpackCoverageConfig = require( "./webpack/coverage.config.js" );
var warningParser = require( "./tools/warning-parser.js" );
var argv = require( "yargs" ).argv;

gulp.task( "webpack:watch", function() {
	webpackDevConfig.watch = true;
	webpackDevConfig.watchDelay = 250;
	webpackTestConfig.watch = true;
	webpackTestConfig.watchDelay = 250;
} );

gulp.task( "webpack:build", [ "generate-config" ], function( done ) {
	gulp.src( "./client/js/boot.js" )
		.pipe( gulpWebpack( webpackConfig, null, function( err, stats ) {
			stats.compilation.warnings = warningParser( {
				warnings: stats.compilation.warnings,
				filters: [
					// Filter out items from node_modules and tableau
					/(~|tableau_v8)/,
					// Filter out less/css errors related to style loader
					function( line ) {
						return /\.(c|le)ss/.test( line ) && /Side effects|Dropping|Condition/.test( line );
					}
				]
			} );

			var json = stats.toJson( {}, true );

			var fileStats = {
				css: {
					label: "LESS/CSS",
					files: [],
					size: 0
				},
				app: {
					label: "App Code",
					files: [],
					size: 0
				},
				lib: {
					label: "Libaries",
					files: [],
					size: 0
				}
			};

			json.chunks.forEach( function( chunk ) {
				chunk.modules.forEach( function( module ) {
					var name = _.last( module.name.split( "!" ) );
					var config = fileStats.app;

					if ( /\.less/.test( name ) ) {
						config = fileStats.css;
					} else if ( /(\~|webpack)/.test( name ) ) {
						config = fileStats.lib;
					}
					config.files.push( name );
					config.size += module.size;
				} );
			} );

			var total = fileStats.css.size + fileStats.lib.size + fileStats.app.size;

			gutil.log( gutil.colors.green( "--------- Build Finished in " + ( ( stats.endTime - stats.startTime ) / 1000 ) + "s ----------" ) );

			_.each( fileStats, function( group ) {
				var percent = ( Math.round( ( group.size / total ) * 10000 ) / 100 );
				if ( argv.verbose ) {
					gutil.log( gutil.colors.green(
						group.label,
						"Size: " + group.size,
						"Percentage: " + percent + "%",
						"Files: \n\t" + group.files.join( "\n  " ) + "\n"
					) );
				} else {
					gutil.log( gutil.colors.green(
						group.label,
						"Files: " + group.files.length,
						"Size: " + group.size,
						"Percentage: " + percent + "%"
					) );
				}
			} );

			gutil.log();
			gutil.log( gutil.colors.dim( "File sizes are before compression and do not reflect percentage of final output. Run build again with --verbose to see all files." ) );
			gutil.log();

			gutil.log( stats.toString( {
				hash: false,
				version: false,
				timings: false,
				assets: false,
				chunks: false,
				chunkModules: false,
				modules: false,
				cached: false,
				reasons: false,
				source: false,
				errorDetails: false,
				chunkOrigins: false,
				modulesSort: false,
				chunksSort: false,
				assetsSort: false,
				colors: true
			} ) );
		} ) )
		.pipe( gulp.dest( "./public/js" ) )
		.on( "end", done );
} );

gulp.task( "webpack:dev", [ "format", "generate-config" ], function( done ) {
	var doneOnce = false;

	gulp.src( "./client/js/boot.js" )
		.pipe( gulpWebpack( webpackDevConfig, null, function( err, stats ) {
			gutil.log( stats.toString( {
				version: false,
				hash: false,
				chunks: false,
				colors: true
			} ) );

			// This statement keeps done from being called after
			// webpack watch triggers a rebuild
			if ( webpackDevConfig.watch !== true || doneOnce === false ) {
				doneOnce = true;
				done();
			}
		} ) )
		.pipe( gulp.dest( "./public/js" ) );
} );

function webpackSpecBuild( config, done ) {
	var doneOnce = false;

	webpack( config, function( err, stats ) {
		// This statement keeps done from being called after
		// webpack watch triggers a rebuild
		var _stats = stats.toJson( {
			hash: false,
			version: false,
			timings: true,
			assets: false,
			chunks: false,
			chunkModules: false,
			modules: false,
			cached: false,
			reasons: false,
			source: false,
			errorDetails: false,
			chunkOrigins: false,
			modulesSort: false,
			chunksSort: false,
			assetsSort: false,
			colors: true
		} );
		delete _stats.warnings;
		gutil.log( stats.constructor.jsonToString( _stats, true ) );

		if ( config.watch !== true || doneOnce === false ) {
			doneOnce = true;
			done();
		}
	} );
}

gulp.task( "webpack:test", [ "format", "generate-config", "test:build-karma-index" ], function( done ) {
	webpackSpecBuild( webpackTestConfig, done );
} );

gulp.task( "webpack:coverage", [ "format", "generate-config", "test:build-karma-index" ], function( done ) {
	webpackSpecBuild( webpackCoverageConfig, done );
} );
