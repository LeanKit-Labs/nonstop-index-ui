import lux from "lux.js";
import { get as _get, set as _set } from "lodash";

export default new lux.Store( {
	namespace: "project",
	state: {
		packages: {},
		projects: {}
	},
	handlers: {
		loadProjects() {},
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

		return Object.keys( projects ).map( project => {
			return { name: project };
		} );
	}
} );
