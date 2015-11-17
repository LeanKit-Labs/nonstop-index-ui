import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";
import config from "../clientConfig";

var nsAPI = window.nsAPI = halon( {
	root: `${ config.nonstopIndexApi }`,
	knownOptions: {
		package: [ "list" ],
		host: [ "list" ]
	},
	adapter: halon.jQueryAdapter( $ ),
	version: 1,
	headers: config.headers
} );

function errorHandler( error ) {
	console.error( error );
}

nsAPI.connect().catch( errorHandler );

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
		"loadHostsSuccess",
		"loadHostsError"
	],
	namespace: "api",
	handlers: {
		initializePage() {
			loadProjects();
		},
		loadProjects() {
			loadProjects();
		},
		loadHosts() {
			nsAPI.host.list()
				.then(
					( data ) => this.loadHostsSuccess( data ),
					( data ) => this.loadHostsError( data )
				);
		}
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
