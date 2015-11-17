import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";
import config from "../clientConfig";
import hostsResponse from "../../spec/data/hostsResponse.js";

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
	return nsAPI.package.list()
		.then(
			( data ) => lux.publishAction( "loadProjectsSuccess", data ),
			( data ) => lux.publishAction( "loadProjectsError", data )
		);
}

function loadHosts() {
	return nsAPI.host.list()
		.then(
			( data ) => lux.publishAction( "loadHostsSuccess", hostsResponse ),
			( data ) => lux.publishAction( "loadHostsError", data )
		);
}

export default lux.mixin( {
	getActions: [
		"pageInitialized"
	],
	namespace: "api",
	handlers: {
		initializePage() {
			loadProjects().then( loadHosts );
		},
		loadProjects,
		loadHosts
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
