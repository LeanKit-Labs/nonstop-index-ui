import projectStoreFactory from "inject!stores/projectStore";

const packagesResponse = require( "../data/packagesResponse" );
const projectsParsed = require( "../data/projectsParsed" );

describe( "project store", () => {
	let projectStore;

	beforeEach( () => {
		projectStore = projectStoreFactory( {} );
	} );

	afterEach( () => {
		projectStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			projectStore.getState().should.eql( {
				projects: {},
				packages: {}
			} );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling loadProjectsSuccess", () => {
			it( "should parse and save the packages and projects", () => {
				lux.publishAction( "loadProjectsSuccess", packagesResponse );
				const state = projectStore.getState();
				state.should.be.eql( projectsParsed );
			} );
		} );
	} );

	describe( "helper functions", () => {
		it( "should provide a way to get the projects list", () => {
			Object.assign( projectStore.getState(), projectsParsed );
			projectStore.getProjects().should.eql( [
				{ name: "core-blu" },
				{ name: "nonstop-index-ui" }
			] );
		} );
	} );
} );
