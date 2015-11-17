import lux from "lux.js";
import { reduce, get as _get, set as _set } from "lodash";

export default new lux.Store( {
	namespace: "project",
	state: {
		packages: {},
		projects: {}
	},
	handlers: {
		loadProjectsSuccess( { packages } ) {
			this.setState( this.reduceProjects( packages ) );
		}
	},
	reduceProjects( packages ) {
		return packages.reduce( ( memo, item ) => {
			const versionPath = [ "projects", item.project, "owners", item.owner, "branches", item.branch ];
			let versions = _get( memo, versionPath, [] );

			versions.push( item.file );
			_set( memo, versionPath, versions );
			memo.packages[item.file] = item;

			return memo;
		}, {
			projects: {},
			packages: {}
		} );
	},
	getProjects() {
		let projects = this.getState().projects;

		return reduce( projects, ( memo, project, name ) => {
			const owner = Object.keys( project.owners )[ 0 ];
			const branch = Object.keys( project.owners[ owner ].branches )[ 0 ];
			memo.push( {
				name,
				owner,
				branch
			} );
			return memo;
		}, [] );
	},
	getProject( name, owner, branch ) {
		const { packages, projects } = this.getState();
		const currentProject = projects[name];

		if ( !currentProject ) {
			return { owners: [], branches: [], packages: [] };
		}

		const currentOwner = currentProject.owners[owner];
		let branchPackages = _get( currentOwner, [ "branches", branch ], [] );

		const versions = branchPackages.reduce( ( memo, name ) => {
			let item = packages[name];
			let version = item.version.split('-')[0];

			const packagesPath = [ version, "builds", `b${item.build}`, "packages" ];
			let buildPackages = _get( memo, packagesPath, [] );

			buildPackages.push( item );
			_set( memo, packagesPath, buildPackages );

			return memo;
		}, {} );

		return {
			owners: Object.keys( currentProject.owners ),
			branches: Object.keys( currentOwner.branches ),
			versions
		};
	}
} );
