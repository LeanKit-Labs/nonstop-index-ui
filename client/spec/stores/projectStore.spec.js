import projectStoreFactory from "inject!stores/projectStore";

const packagesResponse = require( "../data/packagesResponse" );
const projectsParsed = require( "../data/projectsParsed" );
const hostsResponse = require( "../data/hostsResponse" );
const projectsWithHostsParsed = require( "../data/projectsWithHostsParsed" );

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
				packages: {},
				hosts: []
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

		describe( "when handling loadHostsSuccess", () => {
			it( "should add hosts to projects", () => {
				const state = projectStore.getState();
				state.projects = projectsParsed.projects;
				lux.publishAction( "loadHostsSuccess", hostsResponse );
				state.projects.should.eql( projectsWithHostsParsed );
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

		describe( "getProject before project has been loaded", () => {
			it( "should return an results with empty properties", () => {
				const project = projectStore.getProject( "core-blu", "BanditSoftware", "master" );
				project.should.eql( {
					owners: [],
					branches: [],
					versions: {},
					hosts: []
				} );
			} );
		} );

		describe( "getProject after project has been loaded", () => {
			let project;

			beforeEach( () => {
				Object.assign( projectStore.getState(), projectsParsed );
				project = projectStore.getProject( "core-blu", "BanditSoftware", "master" );
			} );

			it( "should get a list of owners and branches", () => {
				project.owners.should.eql( [ {
					name: "BanditSoftware",
					branches: [ "master" ]
				} ] );
				project.branches.should.eql( [ "master" ] );
			} );

			it( "should get a list of known versions", () => {
				project.versions.should.have.key( "0.1.5" );
			} );

			it( "should separate by builds for each version", () => {
				const version = project.versions[ "0.1.5" ];
				version.builds.should.have.keys( "b11", "b10" );
			} );

			it( "should group packages for each build", () => {
				const version = project.versions[ "0.1.5" ];
				const build10 = version.builds.b10;
				const build11 = version.builds.b11;
				build10.packages.should.have.lengthOf( 1 );
				build10.packages[ 0 ].should.be.an( "object" );
				build11.packages.should.have.lengthOf( 1 );
				build11.packages[ 0 ].should.be.an( "object" );
			} );
		} );
	} );
} );
