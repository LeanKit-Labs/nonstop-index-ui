import lux from "lux.js";
import { map, reduce, get as _get, set as _set, find } from "lodash";

function getHostDetails( host ) {
	const { project: projectName, branch, owner } = host.package;
	const { name: hostName, ip } = host.serviceHost.host;

	return {
		name: host.name,
		projectName,
		branch,
		owner,
		hostName,
		ip
	};
}

export default new lux.Store( {
	namespace: "project",
	state: {
		packages: {},
		projects: {},
		hosts: []
	},
	handlers: {
		loadProjectsSuccess( { packages } ) {
			this.setState( this.reduceProjects( packages ) );
		},
		loadHostsSuccess( { hosts = [] } ) {
			const mappedHosts = hosts.map( getHostDetails );

			this.setState( {
				projects: this.addHostsToProjects( mappedHosts ),
				hosts: mappedHosts
			} );
		},
		loadHostStatusSuccess( { name, status } ) {
			const host = find( this.getState().hosts, { name } );
			if ( host ) {
				host.status = {
					serviceUptime: _get( status, [ "uptime", "service" ], "" ),
					hostUptime: _get( status, [ "uptime", "host" ], "" ),
					slug: _get( status.activity, [ "running", "slug" ], "" ),
					version: _get( status.activity, [ "running", "version" ], "" )
				};
			}
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
	addHostsToProjects( hosts ) {
		return reduce( hosts, ( memo, host ) => {
			const project = memo[ host.projectName ];

			if ( project ) {
				project.hosts = project.hosts || [];
				project.hosts.push( host );
			}

			return memo;
		}, this.getState().projects );
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
			return { owners: [], branches: [], versions: {}, hosts: [] };
		}

		const currentOwner = currentProject.owners[owner];
		let branchPackages = _get( currentOwner, [ "branches", branch ], [] );

		const versions = branchPackages.reduce( ( memo, name ) => {
			let item = packages[name];
			let version = item.version.split( "-" )[0];

			const packagesPath = [ version, "builds", `b${item.build}`, "packages" ];
			let buildPackages = _get( memo, packagesPath, [] );

			buildPackages.push( item );
			_set( memo, packagesPath, buildPackages );

			return memo;
		}, {} );

		return {
			owners: map( currentProject.owners, ( owner, name ) => {
				return {
					name,
					branches: Object.keys( owner.branches )
				};
			} ),
			branches: Object.keys( currentOwner.branches ),
			versions,
			hosts: currentProject.hosts || []
		};
	},
	getHosts() {
		return this.getState().hosts;
	}
} );
