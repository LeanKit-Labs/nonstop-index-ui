var webpack = require( "webpack" );
var _ = require( "lodash" );
var path = require( "path" );
var shared = _.cloneDeep( require( "./shared.config" ) );
var pathChunkingPlugin = require( "../tools/pathChunkingPlugin" );

module.exports = _.merge( shared, {
	debug: true,
	entry: [
		"webpack-hot-middleware/client?reload=true",
		path.join( appConfig.root, "./client/js/boot.js" )
	],
	devtool: "cheap-module-eval-source-map",
	output: {
		path: path.join( appConfig.root, "./public/js" ),
		publicPath: appConfig.rootUrl + "/js/",
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
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin( {
			DEBUG: true,
			BROWSER: true
		} ),
		new webpack.IgnorePlugin( /locale/ ),
		pathChunkingPlugin( {
			name: "vendor",
			filename: "vendor.js",
			paths: appConfig.vendorPaths
		} )
	]
} );
