var loader = require( "inject-loader" );

// wrapper to inject-loader that adds an istanbul ignore comment
module.exports = function( input ) {
	return loader( input ).replace( /\|\| require\(/g, "|| /* istanbul ignore next */ require(" );
};
