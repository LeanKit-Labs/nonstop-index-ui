var webpack = require( "webpack" );
var _ = require( "lodash" );
var config = _.cloneDeep( require( "./test.config" ) );

// including plugins again, as they error out after being cloned from the test config
config.plugins = [
	new webpack.DefinePlugin( {
		DEBUG: true
	} ),
	new webpack.IgnorePlugin( /locale/ ),
	new webpack.SourceMapDevToolPlugin(
		null, null,
		"[resource-path]", "[resource-path]"
	)
];

config.module.postLoaders = config.module.postLoaders || [];
config.module.postLoaders.push( {
	test: /\.jsx?$/,
	exclude: /(spec\/|client\/js\/lib\/|node_modules\/|zenbox\.js|datepicker\.js)/,
	loader: "istanbul-instrumenter"
} );

config.amdInjectLoader = { istanbul: true };

module.exports = config;
