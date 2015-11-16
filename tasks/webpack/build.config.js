var webpack = require( "webpack" );
var _ = require( "lodash" );
var path = require( "path" );
var shared = _.cloneDeep( require( "./shared.config" ) );
var pathChunkingPlugin = require( "../tools/pathChunkingPlugin" );

function localLoader( loader ) {
	return path.join( appConfig.root, "./tasks/tools/" + loader + "-loader.js" );
}

module.exports = _.merge( shared, {
	entry: path.join( appConfig.root, "client/js/boot.js" ),
	output: {
		path: path.join( appConfig.root, "./public/js" ),
		publicPath: "./js/",
		filename: "main.js"
	},
	module: {
		preLoaders: [
			{
				test: /client\/.+\.(css|js|jsx|less|html)$/,
				loader: localLoader( "prefix" ) + "?prefix=" + appConfig.rootUrl
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin( {
			DEBUG: false,
			BROWSER: true,
			"process.env": {
				NODE_ENV: "\"production\""
			}
		} ),
		new webpack.IgnorePlugin( /locale/ ),
		new webpack.optimize.UglifyJsPlugin( {} ),
		pathChunkingPlugin( {
			name: "vendor",
			filename: "vendor.js",
			paths: appConfig.vendorPaths
		} )
	]
} );
