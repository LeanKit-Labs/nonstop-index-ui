const path = require( "path" );
const config = require( "../../server/config" );
const root = path.join( __dirname, "../.." );

const appConfig = global.appConfig = {
	sourceFilePaths: [ "client/js/**/*.+(js|jsx)", "!client/js/coverage/**/*", "!client/js/lib/**/*" ],
	specFilePaths: [ "client/spec/**/*.+(js|jsx)" ],
	serverFilePaths: [ "server/**/*.js", "!server/coverage/**/*" ],
	vendorPaths: [ path.join( root, "./node_modules/**" ), path.join( root, "./client/js/lib/**" ) ],
	root,
	rootUrl: config.host.urlPrefix
};

module.exports = appConfig;
