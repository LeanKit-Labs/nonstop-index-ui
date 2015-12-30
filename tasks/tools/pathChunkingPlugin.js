const minimatch = require( "minimatch" );
const webpack = require( "webpack" );
const _ = require( "lodash" );

module.exports = function( options ) {
	function isMatchingModule( mod ) {
		return mod.resource && _.some( options.paths, path => minimatch( mod.resource, path ) );
	}

	return new webpack.optimize.CommonsChunkPlugin( {
		name: options.name,
		filename: options.filename,
		minChunks: isMatchingModule
	} );
};
