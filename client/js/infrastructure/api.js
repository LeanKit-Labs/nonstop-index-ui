import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";

var lkAPI = halon( {
	root: `${ window.location.origin }/api/`,
	knownOptions: {},
	adapter: halon.jQueryAdapter( $ ),
	version: 1
} );

function errorHandler( error ) {
	const message = error.toString();
	lux.publishAction( "notifyError", { message } );
	lux.publishAction( "error", error.stack || message );
}

lkAPI.connect().catch( errorHandler );

var uiAPI = halon( {
	root: `${ window.location.origin }/`,
	knownOptions: {
		logging: [ "upload" ],
		metricsCollector: [ "upload" ]
	},
	adapter: halon.jQueryAdapter( $ ),
	version: 1
} );

uiAPI.connect().catch( errorHandler );

export default lux.mixin( {
	getActions: [
		"notifyError",
		"notifySuccess",
		"pageInitialized"
	],
	namespace: "api",
	handlers: {
		initializePage() {},
		sendLogBatch( data ) {
			/* istanbul ignore next */
			function errorHandler( err ) {
				if ( DEBUG ) {
					console.log( "Unable to reach logging endpoint: ", err );
				}
			}
			uiAPI.logging.upload( data ).catch( errorHandler );
		},
		sendMetricsBatch( data ) {
			/* istanbul ignore next */
			function errorHandler( err ) {
				if ( DEBUG ) {
					console.log( "Unable to reach metrics endpoint: ", err );
				}
			}
			uiAPI.metricsCollector.upload( data ).catch( errorHandler );
		}
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
