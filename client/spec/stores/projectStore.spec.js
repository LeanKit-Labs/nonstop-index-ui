import projectStoreFactory from "inject!stores/projectStore";

const packagesResponse = require( "../data/packagesResponse" );
const projectsParsed = require( "../data/projectsParsed" );
const hostsResponse = require( "../data/hostsResponse" );
const projectsWithHostsParsed = require( "../data/projectsWithHostsParsed" );
const hostsWithStatus = require( "../data/hostsWithStatus" );
const statusResponse = require( "../data/statusResponse" );

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

			it( "should handle when a host project is absent", () => {
				lux.publishAction.bind( lux, "loadHostsSuccess", hostsResponse )
					.should.not.throw();
			} );
		} );

		describe( "when handling loadHostStatusSuccess", () => {
			it( "should add status to projects", () => {
				const state = projectStore.getState();
				state.hosts = projectsWithHostsParsed["nonstop-index-ui"].hosts;
				const clock = sinon.useFakeTimers( new Date( 2015, 11, 25, 0, 0, 0 ).getTime() );
				lux.publishAction( "loadHostStatusSuccess", {
					name: "core-blu",
					status: statusResponse
				} );
				clock.restore();
				projectStore.getState().hosts.should.eql( hostsWithStatus );
			} );

			it( "should not add status if host is not found", () => {
				const state = projectStore.getState();
				state.hosts = projectsWithHostsParsed["nonstop-index-ui"].hosts;
				lux.publishAction.bind( lux, "loadHostStatusSuccess", {
					name: "host-not-found",
					status: statusResponse
				} ).should.not.throw();
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

		describe( "getHosts", () => {
			it( "should return an array of hosts", () => {
				const state = projectStore.getState();
				state.projects = projectsParsed.projects;
				lux.publishAction( "loadHostsSuccess", hostsResponse );
				const hosts = projectStore.getHosts();

				hosts.length.should.equal( 2 );
				hosts.should.eql( [
					{ name: "core-blu", projectName: "nonstop-index-ui", branch: "master", owner: "BanditSoftware", hostName: "lkapp.cloudapp.net", ip: "10.0.0.6" },
					{ name: "littlebrudder", projectName: "nonstop-index-ui", branch: "master", owner: "arobson", hostName: "littelbrudder.hack.leankitdev.com", ip: "10.0.0.6" }
				] );
			} );
		} );
	} );
} );
