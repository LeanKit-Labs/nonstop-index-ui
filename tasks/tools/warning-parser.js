var _ = require( "lodash" );
module.exports = function( config ) {
	var warnings = config.warnings;
	var filters = config.filters;

	return warnings.map( function( w ) {
		var warning = w.toString();
		if ( /Uglify/.test( warning ) ) {
			// This first removes all the loaders from the path to clean up the warnings
			var lines = warning.split( /\n/g ).map( function( line ) {
				var matched = /^(.*)\[([^\]]+)\]$/.exec( line );
				if ( !matched ) {
					return line;
				}
				var parts = matched[2].split( /\!/g );
				return matched[1] + "[" + _.last( parts ) + "]";
			} );

			lines = _.reject( lines, function( line ) {
				return _.any( filters, function( test ) {
					if ( typeof test === "function" ) {
						// Callback
						return test( line );
					} else {
						// Regex
						return test.test( line );
					}
				} );
			} );
			// Need to put it back as an error
			return new Error( lines.join( "\n" ) );
		} else {
			return w;
		}
	} );
};
