const webpack = require( "webpack" );
const _ = require( "lodash" );
const path = require( "path" );
const shared = _.cloneDeep( require( "./shared.config" ) );

function localLoader( loader ) {
	return path.join( appConfig.root, `./tasks/tools/${ loader }-loader.js` );
}

module.exports = _.merge( shared, {
	debug: true,
	entry: path.join( appConfig.root, "./client/spec/karma-index.js" ),
	output: {
		path: path.join( appConfig.root, "./_spec-tmp/js" ),
		publicPath: "./js/",
		filename: "test.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
	},
	resolve: {
		alias: {
			helpers: path.resolve( appConfig.root, "./client/spec/helpers" )
		}
	},
	resolveLoader: {
		alias: {
			inject: localLoader( "inject" )
		}
	},
	plugins: [
		new webpack.DefinePlugin( {
			DEBUG: true
		} ),
		new webpack.IgnorePlugin( /locale/ ),
		new webpack.SourceMapDevToolPlugin(
			null, null,
			"[resource-path]", "[resource-path]"
		)
	]
} );
