import lux from "lux.js";
import { map, reduce, get as _get, set as _set, find } from "lodash";

function getHostDetails( host ) {
	const { project, branch, owner } = host.package;
	const { name: hostName, ip } = host.serviceHost.host;

	return {
		name: host.name,
		project,
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
		hosts: [],
		deployChoice: null
	},
	handlers: {
		loadProjectsSuccess( { packages } ) {
			this.setState( this.reduceProjects( packages ) );
		},
		loadHostsSuccess( { hosts } ) {
			const mappedHosts = hosts.map( getHostDetails );

			this.setState( {
				projects: this.addHostsToProjects( mappedHosts ),
				hosts: mappedHosts
			} );
		},
		triggerDeploy( { pkg, host } ) {
			const hostRef = find( this.getState().hosts, { name: host } );
			hostRef.status = null;
			this.setState( {
				deployChoice: {
					pkg, host
				}
			} );
		},
		finalizeDeploy() {
			const { deployChoice } = this.getState();
			deployChoice.saving = true;
			this.setState( { deployChoice } );
		},
		cancelDeploy() {
			this.setState( { deployChoice: null } );
		},
		applySettingsSuccess() {
			this.setState( { deployChoice: null } );
		},
		applySettingsError( e ) {
			const { deployChoice } = this.getState();
			if ( deployChoice ) {
				deployChoice.saving = false;
				deployChoice.error = "There was a problem deploying this package.";
				this.setState( { deployChoice } );
			}
		},
		loadHostStatusSuccess( { name, status } ) {
			const host = find( this.getState().hosts, { name } );
			if ( host ) {
				host.owner = _get( status.activity, "running.owner", host.owner );
				host.project = _get( status.activity, "running.project", host.project );
				host.branch = _get( status.activity, "running.branch", host.branch );
				host.slug = _get( status.activity, "running.slug", host.slug );
				host.version = _get( status.activity, "running.version", host.version ),
				host.status = {
					serviceUptime: _get( status, "uptime.service", "" ),
					hostUptime: _get( status, "uptime.host", "" ),
					fetchTime: new Date()
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
			const project = memo[ host.project ];

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
	},
	getDeployChoice() {
		const { deployChoice, hosts } = this.getState();
		if ( !deployChoice ) {
			return null;
		}
		return Object.assign( {}, deployChoice, {
			host: hosts.find( host => deployChoice.host === host.name )
		} );
	},
	getDeployChoiceSettings() {
		const { pkg, host } = this.getDeployChoice();
		const data = [];
		[ "project", "owner", "branch", "version" ].forEach( function( field ) {
			data.push( { op: "change", field, value: pkg[ field ] } );
		} );
		return {
			name: host.name,
			data
		};
	}
} );
