var gulp = require( "gulp" );
var gulpFile = require( "gulp-file" );
var _ = require( "lodash" );
var pkgJson = require( "../package.json" );

gulp.task( "generate-config", function() {
	var config = require( "../server/config" );
	var clientConfig = _.extend(
		{},
		config.client,
		{
			appName: pkgJson.name,
			key: config.name + ".client",
			version: pkgJson.version
		}
	);
	clientConfig.branding = clientConfig.branding && clientConfig.branding[ appConfig.theme ];
	var file = "export default " + JSON.stringify( clientConfig ) + ";";
	return gulpFile( "clientConfig.js", file, { src: true } )
		.pipe( gulp.dest( "client/js" ) );
} );
