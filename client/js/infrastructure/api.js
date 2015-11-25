import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";
import config from "../clientConfig";
import configurationStore from "stores/configurationStore";
import projectStore from "stores/projectStore";

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

function releasePackage( { architecture, branch, osName, osVersion, owner, platform, project, slug } ) {
	return nsAPI.package.promote( { architecture, branch, osName, osVersion, owner, platform, project, slug } )
		.then(
			( data ) => {
				lux.publishAction( "releasePackageSuccess", data );
				loadProjects();
			},
			( data ) => lux.publishAction( "releasePackageError", data )
		);
}

function loadEnvironmentForHost( options ) {
	return nsAPI.host.getEnvironment( options )
		.then(
			( data ) => lux.publishAction( "loadEnvironmentForHostSuccess", data ),
			( data ) => lux.publishAction( "loadEnvironmentForHostError", data )
		);
}

export default lux.mixin( {
	getActions: [
		"pageInitialized"
	],
	namespace: "api",
	handlers: {
		initializePage() {
			loadProjects();
			loadHosts();
			loadUser();
		},
		finalizeDeploy() {
			applySettings( projectStore.getDeployChoiceSettings() );
		},
		error( msg ) {
			/* istanbul ignore else */
			if ( DEBUG ) {
				console.error( msg );
			}
		},
		loadProjects,
		loadHosts,
		loadUser,
		loadHostStatus,
		loadEnvironmentForHost,
		applySettings,
		releasePackage
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
