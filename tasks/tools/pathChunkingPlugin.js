var minimatch = require( "minimatch" );
var webpack = require( "webpack" );
var _ = require( "lodash" );

module.exports = function( options ) {
	function isMatchingModule( mod ) {
		return mod.resource && _.some( options.paths, function( path ) {
				return minimatch( mod.resource, path );
			} );
	}

	return new webpack.optimize.CommonsChunkPlugin( {
		name: options.name,
		filename: options.filename,
		minChunks: isMatchingModule
	} );
};
