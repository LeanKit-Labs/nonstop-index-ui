const _ = require( "lodash" );

module.exports = function( config ) {
	const warnings = config.warnings;
	const filters = config.filters;

	return warnings.map( w => {
		const warning = w.toString();
		if ( /Uglify/.test( warning ) ) {
			// This first removes all the loaders from the path to clean up the warnings
			let lines = warning.split( /\n/g ).map( line => {
				const matched = /^(.*)\[([^\]]+)\]$/.exec( line );
				if ( !matched ) {
					return line;
				}
				const parts = matched[ 2 ].split( /\!/g );
				return `${matched[ 1 ]}[${_.last( parts )}]`;
			} );

			lines = _.reject( lines, line => {
				return _.any( filters, test => {
					if ( typeof test === "function" ) {
						// Callback
						return test( line );
					}
					// Regex
					return test.test( line );
				} );
			} );
			// Need to put it back as an error
			return new Error( lines.join( "\n" ) );
		}
		return w;
	} );
};
