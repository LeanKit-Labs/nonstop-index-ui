const gulp = require( "gulp" );
const gulpFile = require( "gulp-file" );
const _ = require( "lodash" );
const pkgJson = require( "../package.json" );

gulp.task( "generate-config", () => {
	const config = require( "../server/config" ); // eslint-disable-line global-require
	const clientConfig = _.extend(
		{},
		config.client,
		{
			appName: pkgJson.name,
			key: `${ config.name }.client`,
			version: pkgJson.version,
			urlPrefix: config.host.urlPrefix
		}
	);
	clientConfig.branding = clientConfig.branding && clientConfig.branding[ appConfig.theme ];
	const file = `export default ${ JSON.stringify( clientConfig ) };`;
	return gulpFile( "clientConfig.js", file, { src: true } )
		.pipe( gulp.dest( "client/js" ) );
} );
