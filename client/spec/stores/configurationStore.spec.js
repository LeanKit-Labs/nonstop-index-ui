import configurationStoreFactory from "inject!stores/configurationStore";
import packagesResponse from "../data/packagesResponse";
import hostsParsed from "../data/hostsParsed";
import packagesParsedForConfiguration from "../data/packagesParsedForConfiguration";

describe( "configuration store", () => {
	let configurationStore, mockTree;

	beforeEach( () => {
		configurationStore = configurationStoreFactory( {
			"./projectStore": {
				getHosts: sinon.stub().returns( hostsParsed.hosts )
			}
		} );

		mockTree = {
			projectA: {
				ownerA: {
					branchA: {
						versionA: true,
						versionB: true
					},
					branchB: {
						versionA: true,
						versionC: true
					}
				},
				ownerB: {
					branchA: {
						versionB: true,
						versionC: true
					},
					branchC: {
						versionA: true,
						versionB: true
					}
				}
			},
			projectB: {
				ownerB: {
					branchB: {
						versionB: true
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
				selections: {},
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

		describe( "when handling selections", () => {
			let state, defaultHost;

			beforeEach( () => {
				state = configurationStore.getState();
				state.tree = mockTree;

				defaultHost = hostsParsed.hosts[ 0 ];

				state.selections = {
					project: "projectB",
					owner: "ownerB",
					branch: "branchB",
					version: "versionB"
				};
			} );

			it( "should update the selections from selectProject", () => {
				lux.publishAction( "selectProject", "projectA" );

				state.selections.should.eql( {
					project: "projectA",
					owner: "ownerA",
					branch: "branchA",
					version: "versionA",
					host: defaultHost
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
					host: defaultHost
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
					host: defaultHost
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
					host: defaultHost
				} );
			} );

			it( "should update the selections from selectHost", () => {
				lux.publishAction( "selectHost", { name: "five" } );

				state.selections.should.eql( {
					project: "projectB",
					owner: "ownerB",
					branch: "branchB",
					version: "versionB",
					host: {
						name: "five"
					}
				} );
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
				hosts: hostsParsed.hosts
			} );
		} );

		it( "should provide a way to getChanges", () => {
			configurationStore.getChanges().should.eql( {
				name: "hostA",
				data: [
					{ op: "change", field: "project", value: "projectA" },
					{ op: "change", field: "owner", value: "ownerA" },
					{ op: "change", field: "branch", value: "branchA" },
					{ op: "change", field: "version", value: "versionA" }
				]
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

			it( "should return false when all selections are not set", () => {
				selections.project = null;
				configurationStore.getState().updateInProgress = false;

				configurationStore.getApplyEnabled().should.be.false;
			} );

			it( "should return false when updateInProgress is true", () => {
				configurationStore.getState().updateInProgress = true;
				configurationStore.getApplyEnabled().should.be.false;
			} );

			it( "should return true when all selections are set and updateInProgress in true", () => {
				configurationStore.getApplyEnabled().should.be.true;
			} );
		} );
	} );
} );
