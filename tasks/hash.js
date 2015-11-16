var gulp = require( "gulp" );
var gulpRev = require( "gulp-rev" );
var gulpRevOverride = require( "gulp-rev-css-url" );
var gulpTap = require( "gulp-tap" );
var del = require( "del" );
var _ = require( "lodash" );
var glob = require( "glob" );
var hashedTest = /-[a-f0-9]{10}\./;
var template = require( "gulp-template" );
var pkgJson = require( "../package.json" );

function getFavIconPath() {
	return "images/favicon.gif";
}

gulp.task( "images:copy", function() {
	return gulp.src( "client/images/**/*" )
		.pipe( gulp.dest( "public/images" ) );
} );

function getUnhashedImages() {
	return glob.sync( "public/images/**/*", {
		nodir: true,
		ignore: [ "**/thumbnails/**/*", "public/images/favicon*" ]
	} ).filter( function( f ) {
		return !hashedTest.test( f );
	} );
}

gulp.task( "hashes", [ "images:copy", "css:build", "webpack:build" ], function( next ) {
	var imagePaths = getUnhashedImages();

	gulp.src( [
		"public/js/{main,vendor}.js",
		"public/css/app.css"
	].concat( imagePaths ), { base: "public" } )
		.pipe( gulpRev() )
		.pipe( gulpRevOverride() )
		.pipe( gulp.dest( "public" ) )
		.pipe( gulpRev.manifest() )
		.pipe( gulpTap( function( file, t ) {
			var manifest = JSON.parse( String( file.contents ) );
			var fileConfig = _.reduce( manifest, function( memo, newPath, oldPath ) {
				memo[ oldPath ] = newPath;
				return memo;
			}, {} );

			return gulp.src( "./client/html/**/**.html" )
				.pipe( template( {
					faviconPath: getFavIconPath(),
					urlBase: appConfig.rootUrl,
					files: fileConfig,
					version: pkgJson.version,
					appName: pkgJson.name
				} ) )
				.pipe( gulp.dest( "./public" ) )
				.on( "end", function() {
					// main task does not wait for this inner code to finish, even returning promise (and returning outer gulp.src)
					del( [ "public/js/{main,vendor}.js", "public/css/app.css" ].concat( imagePaths ) ).then( function() {
						next(); // not passed directly to ensure no args passed
					} );
				} );
		} ) );
} );

gulp.task( "index:dev", function() {
	return gulp.src( "./client/html/**/**.html" )
		.pipe( template( {
			faviconPath: getFavIconPath(),
			urlBase: appConfig.rootUrl,
			files: {
				"js/main.js": "js/main.js",
				"js/vendor.js": "js/vendor.js",
				"css/app.css": "css/app.css"
			},
			version: pkgJson.version,
			appName: pkgJson.name
		} ) )
		.pipe( gulp.dest( "./public" ) );
} );
