const gulp = require( "gulp" );
const gulpRev = require( "gulp-rev" );
const gulpRevOverride = require( "gulp-rev-css-url" );
const gulpTap = require( "gulp-tap" );
const del = require( "del" );
const _ = require( "lodash" );
const glob = require( "glob" );
const hashedTest = /-[a-f0-9]{10}\./;
const template = require( "gulp-template" );
const pkgJson = require( "../package.json" );

function getFavIconPath() {
	return "images/favicon.gif";
}

gulp.task( "images:copy", () =>
	gulp.src( "client/images/**/*" ).pipe( gulp.dest( "public/images" ) )
);

function getUnhashedImages() {
	return glob.sync( "public/images/**/*", {
		nodir: true,
		ignore: [ "**/thumbnails/**/*", "public/images/favicon*" ]
	} ).filter( f => !hashedTest.test( f ) );
}

gulp.task( "hashes", [ "images:copy", "css:build", "webpack:build" ], next => {
	const imagePaths = getUnhashedImages();
	const filePaths = [ "public/js/{main,vendor}.js", "public/css/app.css" ].concat( imagePaths );

	gulp.src( filePaths, { base: "public" } )
		.pipe( gulpRev() )
		.pipe( gulpRevOverride() )
		.pipe( gulp.dest( "public" ) )
		.pipe( gulpRev.manifest() )
		.pipe( gulpTap( ( file, t ) => {
			const manifest = JSON.parse( String( file.contents ) );
			const fileConfig = _.reduce( manifest, ( memo, newPath, oldPath ) => {
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
				.on( "end", () => deleteFiles( filePaths ) );
		} ) );

	function deleteFiles( paths ) {
		// main task does not wait for this inner code to finish, even returning promise (and returning outer gulp.src)
		del( paths ).then( () => {
			next(); // not passed directly to ensure no args passed
		} );
	}
} );

gulp.task( "index:dev", () => gulp.src( "./client/html/**/**.html" )
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
	.pipe( gulp.dest( "./public" ) )
);
