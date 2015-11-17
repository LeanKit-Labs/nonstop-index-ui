import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";
import config from "../clientConfig";

var nsAPI = window.nsAPI = halon( {
	root: `${ config[ "nonstop-index-api" ] }`,
	knownOptions: {
		package: [ "list" ]
	},
	adapter: halon.jQueryAdapter( $ ),
	version: 1,
	headers: config.headers
} );

function errorHandler( error ) {
	const message = error.toString();
	lux.publishAction( "error", error.stack || message );
}

nsAPI.connect().catch( errorHandler );

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

function loadProjects() {
	nsAPI.package.list()
		.then(
			( data ) => lux.publishAction( "loadProjectsSuccess", data ),
			( data ) => lux.publishAction( "loadProjectsError", data )
		);
}

export default lux.mixin( {
	getActions: [
		"pageInitialized",
		"loadProjectsSuccess",
		"loadProjectsError"

	],
	namespace: "api",
	handlers: {
		initializePage() {
			loadProjects();
		},
		loadProjects() {
			loadProjects();
		}
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
