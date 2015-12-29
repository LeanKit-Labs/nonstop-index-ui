import lux from "lux.js";
import { map, reduce, get as _get, set as _set, find, clone, cloneDeep, groupBy, sortBy } from "lodash";

function reduceProjects( packages ) {
	const releases = packages.reduce( ( memo, item ) => {
		if ( item.build ) {
			return memo;
		}
		memo[ `${item.relative}-${item.architecture}-${item.platform}-${item.version}` ] = item.slug;
		return memo;
	}, {} );
	return packages.reduce( ( memo, item ) => {
		if ( !item.build ) {
			return memo;
		}
		const versionPath = [ "projects", item.project, "owners", item.owner, "branches", item.branch ];
		let versions = _get( memo, versionPath, [] );

		versions.push( item.file );
		_set( memo, versionPath, versions );
		item.simpleVersion = item.simpleVersion || item.version.split( "-" )[ 0 ];
		const releaseCheck = releases[ `${item.relative}-${item.architecture}-${item.platform}-${item.simpleVersion}` ];
		item.released = releaseCheck === item.slug;
		item.releasable = !releaseCheck;
		memo.packages[ item.file ] = item;

		return memo;
	}, {
		projects: {},
		packages: {}
	} );
}

export default new lux.Store( {
	namespace: "project",
	state: {
		packages: {},
		projects: {},
		hosts: [],
		hostByProject: {},
		deployChoice: null,
		releaseChoice: null
	},
	handlers: {
		loadProjectsSuccess( { packages: pkgs } ) {
			const packages = cloneDeep( pkgs );
			this.setState( reduceProjects( packages ) );
		},
		loadHostsSuccess( { hosts } ) {
			const mappedHosts = sortBy( hosts.map( this.mapHostDetails ), "name" );

			this.setState( {
				hostByProject: groupBy( mappedHosts, "project" ),
				hosts: mappedHosts
			} );
		},
		triggerDeploy( { pkg: packageSource, host } ) {
			const hostRef = find( this.getState().hosts, { name: host } );
			hostRef.status = null;
			const pkg = clone( packageSource );
			if ( pkg.released ) {
				pkg.version = pkg.simpleVersion;
				pkg.build = "";
			}
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
		},
		confirmReleasePackage( pkg ) {
			this.setState( { releaseChoice: pkg } );
		},
		releasePackage() {
			this.setState( { releaseChoice: null } );
		},
		cancelReleasePackage() {
			this.setState( { releaseChoice: null } );
		},
		releasePackageSuccess() {
			this.setState( { releaseChoice: null } );
		},
		releasePackageError() {
			this.setState( { releaseChoice: null } );
		}
	},
	getProjects() {
		let projects = this.getState().projects;

		return sortBy( reduce( projects, ( memo, project, name ) => {
			const owner = Object.keys( project.owners )[ 0 ];
			const branch = Object.keys( project.owners[ owner ].branches )[ 0 ];
			memo.push( {
				name,
				owner,
				branch
			} );
			return memo;
		}, [] ), "name" );
	},
	getProject( name, owner, branch ) {
		const { packages, projects, hostByProject } = this.getState();
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
			hosts: hostByProject[ name ] || []
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
	},
	getReleaseChoice() {
		const { releaseChoice } = this.getState();
		return releaseChoice || null;
	},
	mapHostDetails( host ) {
		const { project, branch, owner, releaseOnly } = host.package;
		const { name: hostName, ip } = host.serviceHost.host;

		return {
			name: host.name,
			project,
			branch,
			owner,
			hostName,
			ip,
			releaseOnly
		};
	}
} );
