import lux from "lux.js";
import { extend, set as _set, get as _get, each, all, cloneDeep, pick as _pick } from "lodash";
import projectStore from "./projectStore";

// overwrite existing selections with those provide - used to clear child values in cascading logic
function updateSelections( store, updatedSelections ) {
	const { selections: currentSelections, tree } = store.getState();
	const mergedSelections = extend( currentSelections, updatedSelections );

	store.setState( {
		selections: getSelections( mergedSelections, tree )
	} );
}

function getDefaultSelectionsFromHost( host ) {
	const { project, owner, branch, version, releaseOnly } = host;

	return {
		host,
		project,
		owner,
		branch,
		version,
		releaseOnly: !!releaseOnly
	};
}

// use current value or fallback to a default using the first legal value
function getSelections( current, tree ) {
	const project = current.project || Object.keys( tree ).sort()[ 0 ];
	const owner = current.owner || Object.keys( _get( tree, [ project ], [] ) ).sort()[ 0 ];
	const branch = current.branch || Object.keys( _get( tree, [ project, owner ], [] ) ).sort()[ 0 ];
	const version = current.version || Object.keys( _get( tree, [ project, owner, branch ], [] ) ).sort()[ 0 ];

	return {
		project,
		owner,
		branch,
		version,
		host: current.host,
		releaseOnly: current.releaseOnly
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
			version: undefined,
			releaseOnly: false
		},
		updateInProgress: false
	},
	handlers: {
		loadProjectsSuccess( { packages: pkgs } ) {
			const packages = cloneDeep( pkgs );
			const tree = {};
			packages.forEach( function( pkg ) {
				_set( tree, [ pkg.project, pkg.owner, pkg.branch, pkg.version ], pkg );
				pkg.simpleVersion = pkg.simpleVersion || pkg.version.split( "-" )[ 0 ];
				pkg.released = !pkg.build;
			} );
			const selections = getSelections( this.getState().selections, tree );
			this.setState( { packages, tree, selections } );
		},
		loadHostsSuccess( { hosts } ) {
			let selections = {};

			// default values to match the first host
			if ( hosts.length ) {
				let host = projectStore.mapHostDetails( hosts[ 0 ] );
				selections = getDefaultSelectionsFromHost( host );
			}

			updateSelections( this, selections );
		},
		selectProject( project ) {
			updateSelections( this, {
				project: project,
				owner: null,
				branch: null,
				version: null
			} );
		},
		selectOwner( owner ) {
			updateSelections( this, {
				owner: owner,
				branch: null,
				version: null
			} );
		},
		selectBranch( branch ) {
			updateSelections( this, {
				branch: branch,
				version: null
			} );
		},
		selectVersion( version ) {
			updateSelections( this, {
				version: version
			} );
		},
		selectHost( host ) {
			updateSelections( this, getDefaultSelectionsFromHost( host ) );
		},
		setReleaseOnly( value ) {
			const state = this.getState();
			state.selections.releaseOnly = value;

			this.setState( state );
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
		const releaseOnly = state.selections.releaseOnly;
		const versions = Object.keys( _pick( _get( tree, [ selectedProject, selectedOwner, selectedBranch ], [] ), pkg => {
			return !releaseOnly || ( releaseOnly && pkg.released );
		} ) ).sort();
		const selectedVersion = state.selections.version;
		const selectedHost = state.selections.host;

		return {
			projects,
			owners,
			branches,
			versions,
			selectedProject,
			selectedOwner,
			selectedBranch,
			selectedVersion,
			selectedHost,
			releaseOnly
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
		const allTrue = all( state.selections, ( value, key ) => {
			return value || key === "releaseOnly";
		} );

		return allTrue && !state.updateInProgress;
	}
} );
