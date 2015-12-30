import projectStoreFactory from "inject!stores/projectStore";
import { cloneDeep } from "lodash";

const packagesResponse = require( "../data/packagesResponse" );
const projectsParsed = require( "../data/projectsParsed" );
const hostsResponse = require( "../data/hostsResponse" );
const projectsWithHostsParsed = require( "../data/projectsWithHostsParsed" );
const hostsWithStatus = require( "../data/hostsWithStatus" );
const statusResponse = require( "../data/statusResponse" );
const hostsParsed = require( "../data/hostsParsed" );

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
				hosts: [],
				hostByProject: {},
				deployChoice: null,
				releaseChoice: null
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
			it( "should add hosts to state", () => {
				lux.publishAction( "loadHostsSuccess", hostsResponse );
				projectStore.getState().hosts.should.eql( hostsParsed.hosts );
			} );

			it( "should create hostByProject state prop", () => {
				lux.publishAction( "loadHostsSuccess", hostsResponse );
				projectStore.getState().hostByProject.should.eql( {
					"nonstop-index-ui": hostsParsed.hosts
				} );
			} );

			it( "should handle when a host project is absent", () => {
				lux.publishAction.bind( lux, "loadHostsSuccess", hostsResponse )
					.should.not.throw();
			} );
		} );

		describe( "when handling loadHostStatusSuccess", () => {
			it( "should add status to hosts", () => {
				const state = projectStore.getState();
				state.hosts = _.cloneDeep( hostsParsed.hosts );
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
				state.hosts = projectsWithHostsParsed[ "nonstop-index-ui" ].hosts;
				lux.publishAction.bind( lux, "loadHostStatusSuccess", {
					name: "host-not-found",
					status: statusResponse
				} ).should.not.throw();
			} );
		} );

		describe( "when handling triggerDeploy", () => {
			let state;
			beforeEach( () => {
				state = projectStore.getState();
				state.hosts = _.cloneDeep( hostsParsed.hosts );
			} );
			describe( "with a build", () => {
				beforeEach( () => {
					lux.publishAction( "triggerDeploy", { host: "core-blu", pkg: {
						build: "1",
						version: "1.0.0-1",
						simpleVersion: "1.0.0",
						released: false
					} } );
				} );
				it( "should save the status to state", () => {
					state.deployChoice.should.eql( {
						host: "core-blu",
						pkg: {
							build: "1",
							version: "1.0.0-1",
							simpleVersion: "1.0.0",
							released: false
						}
					} );
				} );
				it( "should clear out host status", () => {
					should.equal( state.hosts[ 0 ].status, null );
				} );
			} );

			describe( "with a release", () => {
				beforeEach( () => {
					lux.publishAction( "triggerDeploy", { host: "core-blu", pkg: {
						build: "1",
						version: "1.0.0-1",
						simpleVersion: "1.0.0",
						released: true
					} } );
				} );
				it( "should save the status to state", () => {
					state.deployChoice.should.eql( {
						host: "core-blu",
						pkg: {
							build: "",
							version: "1.0.0",
							simpleVersion: "1.0.0",
							released: true
						}
					} );
				} );
				it( "should clear out host status", () => {
					should.equal( state.hosts[ 0 ].status, null );
				} );
			} );
		} );
		describe( "when handling finalizeDeploy", () => {
			it( "should set saving to true", () => {
				const state = projectStore.getState();
				state.deployChoice = {};
				lux.publishAction( "finalizeDeploy" );
				state.deployChoice.saving.should.be.true;
			} );
		} );
		describe( "when handling cancelDeploy", () => {
			it( "should clear out deployChoice", () => {
				const state = projectStore.getState();
				state.deployChoice = {};
				lux.publishAction( "cancelDeploy" );
				should.equal( state.deployChoice, null );
			} );
		} );
		describe( "when handling applySettingsSuccess", () => {
			it( "should clear out deployChoice", () => {
				const state = projectStore.getState();
				state.deployChoice = {};
				lux.publishAction( "applySettingsSuccess" );
				should.equal( state.deployChoice, null );
			} );
		} );
		describe( "when handling applySettingsError", () => {
			it( "should save the error if deployChoice is present", () => {
				const state = projectStore.getState();
				state.deployChoice = {};
				lux.publishAction( "applySettingsError" );
				state.deployChoice.saving.should.be.false;
				state.deployChoice.error.should.equal( "There was a problem deploying this package." );
			} );
			it( "should not save the error if deployChoice is missing", () => {
				lux.publishAction( "applySettingsError" );
				should.equal( projectStore.getState().deployChoice, null );
			} );
		} );
		describe( "when handling confirmReleasePackage", () => {
			it( "should save the release choice to state", () => {
				lux.publishAction( "confirmReleasePackage", packagesResponse.packages[ 0 ] );
				projectStore.getState().releaseChoice.should.eql( packagesResponse.packages[ 0 ] );
			} );
		} );
		describe( "when handling releasePackage", () => {
			it( "should remove the release choice to state", () => {
				lux.publishAction( "releasePackage" );
				should.equal( projectStore.getState().releaseChoice, null );
			} );
		} );
		describe( "when handling cancelReleasePackage", () => {
			it( "should remove the release choice to state", () => {
				lux.publishAction( "cancelReleasePackage" );
				should.equal( projectStore.getState().releaseChoice, null );
			} );
		} );
		describe( "when handling releasePackageSuccess", () => {
			it( "should remove the release choice to state", () => {
				lux.publishAction( "releasePackageSuccess" );
				should.equal( projectStore.getState().releaseChoice, null );
			} );
		} );
		describe( "when handling releasePackageError", () => {
			it( "should remove the release choice to state", () => {
				lux.publishAction( "releasePackageError" );
				should.equal( projectStore.getState().releaseChoice, null );
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

		describe( "getDeployChoice", () => {
			it( "should return null if not set", () => {
				should.equal( projectStore.getDeployChoice(), null );
			} );
			it( "should return deployChoice with complete host", () => {
				Object.assign( projectStore.getState(), {
					hosts: _.cloneDeep( hostsParsed.hosts ),
					deployChoice: {
						pkg: {
							project: "Heyo"
						},
						host: "core-blu"
					}
				} );

				projectStore.getDeployChoice().should.eql( {
					host: {
						branch: "master",
						hostName: "lkapp.cloudapp.net",
						ip: "10.0.0.6",
						name: "core-blu",
						owner: "BanditSoftware",
						project: "nonstop-index-ui",
						releaseOnly: false
					},
					pkg: {
						project: "Heyo"
					}
				} );
			} );
		} );

		describe( "getDeployChoiceSettings", () => {
			beforeEach( () => {
				Object.assign( projectStore.getState(), {
					hosts: _.cloneDeep( hostsParsed.hosts ),
					deployChoice: {
						pkg: {
							project: "heyo",
							owner: "mah",
							branch: "master",
							version: "1.0.0-12"
						},
						host: "core-blu"
					}
				} );
			} );
			it( "should prepare data for transit", () => {
				projectStore.getDeployChoiceSettings().should.eql( {
					name: "core-blu",
					data: [
						{ op: "change", field: "project", value: "heyo" },
						{ op: "change", field: "owner", value: "mah" },
						{ op: "change", field: "branch", value: "master" },
						{ op: "change", field: "version", value: "1.0.0-12" }
					]
				} );
			} );
		} );

		describe( "getReleaseChoice", () => {
			it( "should return null if not set", () => {
				should.equal( projectStore.getReleaseChoice(), null );
			} );
			it( "should return releaseChoice if set", () => {
				Object.assign( projectStore.getState(), {
					releaseChoice: cloneDeep( packagesResponse.packages[ 0 ] )
				} );

				projectStore.getReleaseChoice().should.eql( packagesResponse.packages[ 0 ] );
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
					{
						name: "core-blu",
						project: "nonstop-index-ui",
						branch: "master",
						owner: "BanditSoftware",
						hostName: "lkapp.cloudapp.net",
						ip: "10.0.0.6",
						releaseOnly: false
					},
					{
						name: "littlebrudder",
						project: "nonstop-index-ui",
						branch: "master",
						owner: "arobson",
						hostName: "littelbrudder.hack.leankitdev.com",
						ip: "10.0.0.6",
						releaseOnly: true
					}
				] );
			} );
		} );

		describe( "mapHostDetails", () => {
			it( "should return an internal representation of a host", () => {
				projectStore.mapHostDetails( hostsResponse.hosts[ 0 ] ).should.eql( hostsParsed.hosts[ 1 ] );
			} );
		} );
	} );
} );
