import lux from "lux.js";
import { merge, set as _set, get as _get } from "lodash";

function mergeState( store, newState ) {
	var state = store.getState();
	store.setState( merge( state, newState ) );
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
		}
	},
	handlers: {
		loadProjectsSuccess( { packages } ) {
			var tree = {};
			packages.forEach( function( pkg ) {
				_set( tree, [ pkg.project, pkg.owner, pkg.branch, pkg.version ], true );
			} );
			this.setState( { packages, tree } );
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
		}
	},
	getOptions() {
		var state = this.getState();
		var tree = state.tree;
		var selectedProject = state.selections.project || Object.keys( tree ).sort()[0] || [];
		var projects = Object.keys( tree ).sort();

		var owners = Object.keys( _get( tree, [ selectedProject ], [] ) ).sort();
		var selectedOwner = state.selections.owner || owners[0];

		var branches = Object.keys( _get( tree, [ selectedProject, selectedOwner ], [] ) ).sort();
		var selectedBranch = state.selections.branch || branches[0];

		var versions = Object.keys( _get( tree, [ selectedProject, selectedOwner, selectedBranch ], [] ) ).sort();
		var selectedVersion = state.selections.version || versions[0];

		return {
			projects,
			owners,
			branches,
			versions,
			selectedProject,
			selectedOwner,
			selectedBranch,
			selectedVersion
		};
	}
} );
