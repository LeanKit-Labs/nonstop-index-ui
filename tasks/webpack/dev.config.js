var webpack = require( "webpack" );
var _ = require( "lodash" );
var path = require( "path" );
var shared = _.cloneDeep( require( "./shared.config" ) );
var pathChunkingPlugin = require( "../tools/pathChunkingPlugin" );
var sourceMapPath = path.join( "../..", appConfig.rootUrl, "/source/[resource-path]" );

module.exports = _.merge( shared, {
	debug: true,
	entry: path.join( appConfig.root, "./client/js/boot.js" ),
	output: {
		path: path.join( appConfig.root, "./public/js" ),
		publicPath: "./js/",
		filename: "main.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin( {
			DEBUG: true,
			BROWSER: true
		} ),
		new webpack.IgnorePlugin( /locale/ ),
		new webpack.SourceMapDevToolPlugin(
			null, null,
			sourceMapPath, sourceMapPath
		),
		pathChunkingPlugin( {
			name: "vendor",
			filename: "vendor.js",
			paths: appConfig.vendorPaths
		} )
	]
} );
