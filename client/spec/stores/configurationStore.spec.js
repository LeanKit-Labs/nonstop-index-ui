import configurationStoreFactory from "inject!stores/configurationStore";
import packagesResponse from "../data/packagesResponse";
import hostsResponse from "../data/hostsResponse";
import hostsParsed from "../data/hostsParsed";
import packagesParsedForConfiguration from "../data/packagesParsedForConfiguration";

describe( "configuration store", () => {
	let configurationStore, mockTree;

	beforeEach( () => {
		configurationStore = configurationStoreFactory( {
			"./projectStore": {
				getHosts: sinon.stub().returns( hostsParsed.hosts ),
				mapHostDetails: sinon.stub().returns( {
					name: "one",
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA"
				} )
			}
		} );

		const mockPackages = [
			{ project: "projectA", owner: "ownerA", branch: "branchA", version: "versionA", simpleVersion: "vA" },
			{ project: "projectA", owner: "ownerA", branch: "branchA", version: "versionB", simpleVersion: "vB", released: true },
			{ project: "projectA", owner: "ownerA", branch: "branchB", version: "versionA", simpleVersion: "vA" },
			{ project: "projectA", owner: "ownerA", branch: "branchB", version: "versionC", simpleVersion: "vC" },
			{ project: "projectA", owner: "ownerB", branch: "branchA", version: "versionA", simpleVersion: "vA" },
			{ project: "projectA", owner: "ownerB", branch: "branchA", version: "versionC", simpleVersion: "vC" },
			{ project: "projectA", owner: "ownerB", branch: "branchB", version: "versionA", simpleVersion: "vA" },
			{ project: "projectA", owner: "ownerB", branch: "branchB", version: "versionC", simpleVersion: "vC" },
			{ project: "projectB", owner: "ownerB", branch: "branchB", version: "versionB", simpleVersion: "vB" }
		];

		mockTree = {
			projectA: {
				ownerA: {
					branchA: {
						versionA: mockPackages[ 0 ],
						versionB: mockPackages[ 1 ]
					},
					branchB: {
						versionA: mockPackages[ 2 ],
						versionC: mockPackages[ 3 ]
					}
				},
				ownerB: {
					branchA: {
						versionB: mockPackages[ 4 ],
						versionC: mockPackages[ 5 ]
					},
					branchC: {
						versionA: mockPackages[ 6 ],
						versionB: mockPackages[ 7 ]
					}
				}
			},
			projectB: {
				ownerB: {
					branchB: {
						versionB: mockPackages[ 8 ]
					}
				}
			}
		};
	} );

	afterEach( () => {
		configurationStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			configurationStore.getState().should.eql( {
				tree: {},
				packages: [],
				selections: {
					pullBuild: "SingleBuild"
				},
				updateInProgress: false
			} );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling loadProjectsSuccess", () => {
			it( "should create a tree of values", () => {
				lux.publishAction( "loadProjectsSuccess", packagesResponse );
				const state = configurationStore.getState();
				state.should.eql( packagesParsedForConfiguration );
			} );
		} );

		describe( "when handling loadHostsSuccess", () => {
			it( "should update selections with a default host", () => {
				lux.publishAction( "loadHostsSuccess", hostsResponse );

				const state = configurationStore.getState();

				state.selections.should.eql( {
					branch: "branchA",
					owner: "ownerA",
					project: "projectA",
					pullBuild: "SingleBuild",
					version: "versionA",
					host: {
						branch: "branchA",
						name: "one",
						owner: "ownerA",
						project: "projectA",
						version: "versionA"
					}
				} );
			} );

			it( "should handle keep defaults for selections when no hosts are returned", () => {
				lux.publishAction( "loadHostsSuccess", { hosts: [] } );

				configurationStore.getState().selections.should.eql( {
					branch: undefined,
					host: undefined,
					owner: undefined,
					project: undefined,
					pullBuild: "SingleBuild",
					version: undefined
				} );
			} );
		} );

		describe( "when handling selections", () => {
			let state;

			beforeEach( () => {
				state = configurationStore.getState();
				state.tree = mockTree;

				state.selections = {
					project: "projectB",
					owner: "ownerB",
					branch: "branchB",
					version: "versionB",
					pullBuild: "SingleBuild"
				};
			} );

			it( "should update the selections from selectProject", () => {
				lux.publishAction( "selectProject", "projectA" );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA",
					host: undefined,
					pullBuild: "SingleBuild"
				} );
			} );

			it( "should update the selections from selectOwner", () => {
				state.selections.project = "projectA";
				lux.publishAction( "selectOwner", "ownerB" );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerB",
					branch: "branchA",
					version: "versionB",
					host: undefined,
					pullBuild: "SingleBuild"
				} );
			} );

			it( "should update the selections from selectBranch", () => {
				Object.assign( state.selections, {
					project: "projectA",
					owner: "ownerA"
				} );

				lux.publishAction( "selectBranch", "branchB" );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerA",
					branch: "branchB",
					version: "versionA",
					host: undefined,
					pullBuild: "SingleBuild"
				} );
			} );

			it( "should update the selections from selectVersion", () => {
				Object.assign( state.selections, {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA"
				} );

				lux.publishAction( "selectVersion", "versionB" );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionB",
					host: undefined,
					pullBuild: "SingleBuild"
				} );
			} );

			it( "should update the selections from selectHost", () => {
				const host = {
					name: "five",
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA",
					releaseOnly: true
				};

				lux.publishAction( "selectHost", host );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA",
					host,
					pullBuild: "ReleaseOnly"
				} );
			} );

			it( "should update releaseOnly from setPull action", () => {
				state.selections = {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA",
					pullBuild: "SingleBuild"
				};

				lux.publishAction( "setPull", "SingleBuild" );
				configurationStore.getState().selections.pullBuild.should.equal( "SingleBuild" );
				configurationStore.getState().selections.version.should.equal( "versionA" );

				lux.publishAction( "setPull", "LatestBuild" );
				configurationStore.getState().selections.pullBuild.should.equal( "LatestBuild" );
				configurationStore.getState().selections.version.should.equal( "vA-*" );

				lux.publishAction( "setPull", "ReleaseOnly" );
				configurationStore.getState().selections.pullBuild.should.equal( "ReleaseOnly" );
				configurationStore.getState().selections.version.should.equal( "versionB" );
			} );
		} );

		describe( "when updating the updateInProgress flag", () => {
			it( "should set flag to true on applySettings", () => {
				lux.publishAction( "applySettings" );
				configurationStore.getState().updateInProgress.should.be.true;
			} );

			it( "should set flag to false on applySettingsSuccess", () => {
				const state = configurationStore.getState();
				state.updateInProgress = true;

				lux.publishAction( "applySettingsSuccess" );
				configurationStore.getState().updateInProgress.should.be.false;
			} );

			it( "should set flag to false on applySettingsError", () => {
				const state = configurationStore.getState();
				state.updateInProgress = true;

				lux.publishAction( "applySettingsError" );
				configurationStore.getState().updateInProgress.should.be.false;
			} );
		} );
	} );

	describe( "helper functions", () => {
		let selections;

		beforeEach( () => {
			selections = configurationStore.getState().selections;
			Object.assign( selections, {
				project: "projectA",
				owner: "ownerA",
				branch: "branchA",
				version: "versionA",
				host: {
					name: "hostA"
				}
			} );
		} );

		describe( "getOptions", () => {
			it( "should provide a way to getOptions", () => {
				const state = configurationStore.getState();

				state.tree = mockTree;

				configurationStore.getOptions().should.eql( {
					selectedProject: "projectA",
					selectedOwner: "ownerA",
					selectedBranch: "branchA",
					selectedVersion: "versionA",
					selectedHost: { name: "hostA" },
					projects: [ "projectA", "projectB" ],
					owners: [ "ownerA", "ownerB" ],
					branches: [ "branchA", "branchB" ],
					versions: [ "versionA", "versionB" ],
					pullBuild: "SingleBuild"
				} );
			} );

			it( "should filter on latest versions when pullBuild is LatestBuild", () => {
				const state = configurationStore.getState();

				state.tree = mockTree;
				state.selections.pullBuild = "LatestBuild";

				configurationStore.getOptions().should.eql( {
					selectedProject: "projectA",
					selectedOwner: "ownerA",
					selectedBranch: "branchA",
					selectedVersion: "versionA",
					selectedHost: { name: "hostA" },
					projects: [ "projectA", "projectB" ],
					owners: [ "ownerA", "ownerB" ],
					branches: [ "branchA", "branchB" ],
					versions: [ "vA-*", "vB-*" ],
					pullBuild: "LatestBuild"
				} );
			} );

			it( "should filter on released versions when pullBuild is ReleaseOnly", () => {
				const state = configurationStore.getState();

				state.tree = mockTree;
				state.selections.pullBuild = "ReleaseOnly";

				configurationStore.getOptions().should.eql( {
					selectedProject: "projectA",
					selectedOwner: "ownerA",
					selectedBranch: "branchA",
					selectedVersion: "versionA",
					selectedHost: { name: "hostA" },
					projects: [ "projectA", "projectB" ],
					owners: [ "ownerA", "ownerB" ],
					branches: [ "branchA", "branchB" ],
					versions: [ "versionB" ],
					pullBuild: "ReleaseOnly"
				} );
			} );
		} );

		describe( "getChanges", () => {
			it( "should provide a way to getChanges", () => {
				configurationStore.getChanges().should.eql( {
					name: "hostA",
					data: [
						{ op: "change", field: "project", value: "projectA" },
						{ op: "change", field: "owner", value: "ownerA" },
						{ op: "change", field: "branch", value: "branchA" },
						{ op: "change", field: "version", value: "versionA" },
						{ op: "change", field: "releaseOnly", value: false }
					]
				} );
			} );

			it( "should remove -* from LatestBuild version", () => {
				const selections = configurationStore.getState().selections;

				selections.pullBuild = "LatestBuild";
				selections.version = "vA-*";
				configurationStore.getChanges().should.eql( {
					name: "hostA",
					data: [
						{ op: "change", field: "project", value: "projectA" },
						{ op: "change", field: "owner", value: "ownerA" },
						{ op: "change", field: "branch", value: "branchA" },
						{ op: "change", field: "version", value: "vA" },
						{ op: "change", field: "releaseOnly", value: false }
					]
				} );
			} );

			it( "should set releaseOnly to true if pullBuild is ReleaseOnly", () => {
				const selections = configurationStore.getState().selections;

				selections.pullBuild = "ReleaseOnly";
				configurationStore.getChanges().should.eql( {
					name: "hostA",
					data: [
						{ op: "change", field: "project", value: "projectA" },
						{ op: "change", field: "owner", value: "ownerA" },
						{ op: "change", field: "branch", value: "branchA" },
						{ op: "change", field: "version", value: "versionA" },
						{ op: "change", field: "releaseOnly", value: true }
					]
				} );
			} );
		} );

		describe( "getApplyEnabled", () => {
			beforeEach( () => {
				selections = configurationStore.getState().selections;
				Object.assign( selections, {
					project: "project",
					owner: "one",
					branch: "two",
					version: "three",
					host: "four"
				} );
			} );

			it( "should return false when all selections other than releaseOnly are not set", () => {
				selections.project = null;
				configurationStore.getState().updateInProgress = false;

				configurationStore.getApplyEnabled().should.be.false;
			} );

			it( "should return false when updateInProgress is true", () => {
				configurationStore.getState().updateInProgress = true;
				configurationStore.getApplyEnabled().should.be.false;
			} );

			it( "should return true when all selections are set and updateInProgress is true", () => {
				configurationStore.getApplyEnabled().should.be.true;
			} );
		} );
	} );
} );
