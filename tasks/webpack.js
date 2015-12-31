const gulp = require( "gulp" );
const gutil = require( "gulp-util" );
const _ = require( "lodash" );
const webpack = require( "webpack" );
const gulpWebpack = require( "webpack-stream" );
const webpackConfig = require( "./webpack/build.config.js" );
const webpackTestConfig = require( "./webpack/test.config.js" );
const webpackCoverageConfig = require( "./webpack/coverage.config.js" );
const warningParser = require( "./tools/warning-parser.js" );
const argv = require( "yargs" ).argv;

gulp.task( "webpack:watch", () => {
	webpackTestConfig.watch = true;
	webpackTestConfig.watchDelay = 250;
} );

gulp.task( "webpack:build", [ "generate-config" ], done => {
	process.env.BABEL_ENV = "production";
	gulp.src( "./client/js/boot.js" )
		.pipe( gulpWebpack( webpackConfig, null, ( err, stats ) => {
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

			const json = stats.toJson( {}, true );

			const fileStats = {
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

			json.chunks.forEach( chunk => {
				chunk.modules.forEach( module => {
					const name = _.last( module.name.split( "!" ) );
					let config = fileStats.app;

					if ( /\.less/.test( name ) ) {
						config = fileStats.css;
					} else if ( /(\~|webpack)/.test( name ) ) {
						config = fileStats.lib;
					}
					config.files.push( name );
					config.size += module.size;
				} );
			} );

			const total = fileStats.css.size + fileStats.lib.size + fileStats.app.size;
			const MILLISECONDS_PER_SECOND = 1000;
			gutil.log( gutil.colors.green( `--------- Build Finished in ${ ( ( stats.endTime - stats.startTime ) / MILLISECONDS_PER_SECOND ) }s ----------` ) );

			_.each( fileStats, group => {
				const FRACTION_TO_PERCENTAGE = 100;
				const percent = Math.round( group.size / total ) * FRACTION_TO_PERCENTAGE;
				if ( argv.verbose ) {
					gutil.log( gutil.colors.green(
						group.label,
						`Size: ${ group.size }`,
						`Percentage: ${ percent }%`,
						`Files: \n\t${ group.files.join( "\n  " ) }\n`
					) );
				} else {
					gutil.log( gutil.colors.green(
						group.label,
						`Files: ${ group.files.length }`,
						`Size: ${ group.size }`,
						`Percentage: ${ percent }%`
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

function webpackSpecBuild( config, done ) {
	let doneOnce = false;

	process.env.BABEL_ENV = "test";

	webpack( config, ( err, stats ) => {
		// This statement keeps done from being called after
		// webpack watch triggers a rebuild
		const _stats = stats.toJson( {
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

gulp.task( "webpack:test", [ "format", "generate-config", "test:build-karma-index" ], done => {
	webpackSpecBuild( webpackTestConfig, done );
} );

gulp.task( "webpack:coverage", [ "format", "generate-config", "test:build-karma-index" ], done => {
	webpackSpecBuild( webpackCoverageConfig, done );
} );
