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
				{ name: "core-blu", owner: "BanditSoftware", branch: "master" },
				{ name: "nonstop-index-ui", owner: "LeanKit-Labs", branch: "master" }
			] );
		} );

		describe( "getProject", () => {
			let project;

			beforeEach( () => {
				Object.assign( projectStore.getState(), projectsParsed );
				project = projectStore.getProject( "core-blu", "BanditSoftware", "master" );
			} );

			it( "should get a list of owners and branches", () => {
				project.owners.should.eql( [ "BanditSoftware" ] );
				project.branches.should.eql( [ "master" ] );
			} );

			it( "should get a list of known packages", () => {
				project.packages.should.have.lengthOf( 2 );
				project.packages[0].should.be.an( "object" );
				project.packages[1].should.be.an( "object" );
			} );
		} );
	} );
} );
