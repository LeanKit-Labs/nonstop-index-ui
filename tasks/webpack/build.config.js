const webpack = require( "webpack" );
const _ = require( "lodash" );
const path = require( "path" );
const shared = _.cloneDeep( require( "./shared.config" ) );
const pathChunkingPlugin = require( "../tools/pathChunkingPlugin" );

module.exports = _.merge( shared, {
	entry: path.join( appConfig.root, "client/js/boot.js" ),
	output: {
		path: path.join( appConfig.root, "./public/js" ),
		publicPath: "./js/",
		filename: "main.js"
	},
	module: {
		preLoaders: []
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
