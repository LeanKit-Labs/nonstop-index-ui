define( [ "lux.js" ], function( lux ) {
	// handle errors (suitable for window.onerror)
	function handleException( message, url, line, column, error ) {
		lux.publishAction( "error", error && error.stack ? error.stack : message );
	}

	// log unhandled rejections
	function handleRejection( rejection ) {
		var logData = rejection.value.toString();

		// add stack, if log message is an Error
		if ( rejection.value instanceof Error && rejection.value.stack ) {
			logData = rejection.value.stack;
		}

		// send to logging
		lux.publishAction( "error", logData );

		/* istanbul ignore next only used for development */
		if ( DEBUG ) {
			setTimeout( function() {
				// get sourcemap support in rejected promises ( based on https://github.com/cujojs/when/issues/416 )
				if ( !rejection.handled ) {
					throw rejection.value;
				}
			}, 0 );
		}
	}

	return {
		handleRejection: handleRejection,
		handleException: handleException
	};
} );
