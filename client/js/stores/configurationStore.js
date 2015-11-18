import lux from "lux.js";
import { merge, set as _set, get as _get, each, all } from "lodash";
import projectStore from "./projectStore";

function mergeState( store, newState ) {
	const state = store.getState();
	store.setState( merge( state, newState ) );
}

function getSelections( current, tree ) {
	const project = current.project || Object.keys( tree ).sort()[0] || [];
	const owner = current.owner || Object.keys( _get( tree, [ project ], [] ) ).sort()[0];
	const branch = current.branch || Object.keys( _get( tree, [ project, owner ], [] ) ).sort()[0];
	const version = current.version || Object.keys( _get( tree, [ project, owner, branch ], [] ) ).sort()[0];
	const host = current.host || projectStore.getHosts()[0];
	return {
		project,
		owner,
		branch,
		version,
		host
	};
}

export default new lux.Store( {
	namespace: "configuration",
	state: {
		tree: {},
		packages: [],
		selections: {
			project: undefined,
			owner: undefined,
			branch: undefined,
			version: undefined
		},
		updateInProgress: false
	},
	handlers: {
		loadProjectsSuccess( { packages } ) {
			const tree = {};
			packages.forEach( function( pkg ) {
				_set( tree, [ pkg.project, pkg.owner, pkg.branch, pkg.version ], true );
			} );
			const selections = getSelections( this.getState().selections, tree );
			this.setState( { packages, tree, selections } );
		},
		selectProject( project ) {
			mergeState( this, {
				selections: {
					project: project,
					owner: undefined,
					branch: undefined,
					version: undefined
				}
			} );
		},
		selectOwner( owner ) {
			mergeState( this, {
				selections: {
					owner: owner,
					branch: undefined,
					version: undefined
				}
			} );
		},
		selectBranch( branch ) {
			mergeState( this, {
				selections: {
					branch: branch,
					version: undefined
				}
			} );
		},
		selectVersion( version ) {
			mergeState( this, {
				selections: {
					version: version
				}
			} );
		},
		selectHost( host ) {
			mergeState( this, {
				selections: {
					host: host
				}
			} );
		},
		applySettings() {
			this.setState( { updateInProgress: true } );
		},
		applySettingsSuccess() {
			this.setState( { updateInProgress: false } );
		},
		applySettingsError() {
			this.setState( { updateInProgress: false } );
		}
	},
	getOptions() {
		const state = this.getState();
		const tree = state.tree;
		const selectedProject = state.selections.project;
		const projects = Object.keys( tree ).sort();

		const owners = Object.keys( _get( tree, [ selectedProject ], [] ) ).sort();
		const selectedOwner = state.selections.owner;

		const branches = Object.keys( _get( tree, [ selectedProject, selectedOwner ], [] ) ).sort();
		const selectedBranch = state.selections.branch;

		const versions = Object.keys( _get( tree, [ selectedProject, selectedOwner, selectedBranch ], [] ) ).sort();
		const selectedVersion = state.selections.version;

		const hosts = projectStore.getHosts();
		const selectedHost = state.selections.host;
		return {
			projects,
			owners,
			branches,
			versions,
			hosts,
			selectedProject,
			selectedOwner,
			selectedBranch,
			selectedVersion,
			selectedHost
		};
	},
	getChanges() {
		const changes = [];
		const state = this.getState();
		each( state.selections, function( value, field ) {
			if ( field !== "host" ) {
				changes.push( { op: "change", field, value } );
			}
		} );
		return {
			name: state.selections.host.name,
			data: changes
		};
	},
	getApplyEnabled() {
		const state = this.getState();
		return all( state.selections ) && !state.updateInProgress;
	}
} );
