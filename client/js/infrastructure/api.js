import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";
import config from "../clientConfig";
import configurationStore from "stores/configurationStore";
import when from "when";

var nsAPI = window.nsAPI = halon( {
	root: `${ config.nonstopIndexApi }`,
	knownOptions: {
		package: [ "list" ],
		host: [ "list" ]
	},
	adapter: halon.jQueryAdapter( $ ),
	version: 1,
	headers: config.headers,
	resourceUrlPrefix: "/index"
} );

function errorHandler( error ) {
	console.error( error );
}

nsAPI.connect().catch( errorHandler );

function applySettings( settings ) {
	settings = settings || configurationStore.getChanges();
	nsAPI.host.configure( settings )
		.then(
			( data ) => lux.publishAction( "applySettingsSuccess", data ),
			( data ) => lux.publishAction( "applySettingsError", data )
		);
}

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
			( data ) => lux.publishAction( "loadHostsSuccess", data ),
			( data ) => lux.publishAction( "loadHostsError", data )
		);
}

function loadHostStatus( host ) {
	return nsAPI.host.status( { name: host } )
		.then(
			( data ) => lux.publishAction( "loadHostStatusSuccess", {
				name: host,
				status: data
			} ),
			( data ) => lux.publishAction( "loadHostStatusError", data )
		);
}

function loadUser() {
	return $.getJSON( "/nonstop/user/me" )
		.then(
			( data ) => lux.publishAction( "loadUserSuccess", data ),
			( data ) => lux.publishAction( "loadUserFailure", data )
		);
}

export default lux.mixin( {
	getActions: [
		"pageInitialized"
	],
	namespace: "api",
	handlers: {
		initializePage() {
			when.join(
				loadProjects().then( loadHosts ),
				loadUser()
			);
		},
		loadProjects,
		loadHosts,
		loadUser,
		loadHostStatus,
		applySettings
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
