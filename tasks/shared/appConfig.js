var path = require( "path" );
var config = require( "../../server/config" );
var root = path.join( __dirname, "../.." );

var appConfig = global.appConfig = {
	sourceFilePaths: [ "client/js/**/*.+(js|jsx)", "!client/js/coverage/**/*", "!client/js/lib/**/*" ],
	specFilePaths: [ "client/spec/**/*.+(js|jsx)" ],
	serverFilePaths: [ "server/**/*.js", "!server/coverage/**/*" ],
	vendorPaths: [ path.join( root, "./node_modules/**" ), path.join( root, "./client/js/lib/**" ) ],
	root: root,
	rootUrl: config.host.urlPrefix
};

module.exports = appConfig;
