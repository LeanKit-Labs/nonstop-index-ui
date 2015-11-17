import React from "react";
import { padLeft, map, flatten } from "lodash";

import "./VersionGroup.less";

const architectures = {
	x86: "32 bit",
	x64: "64 bit"
};

function architecture( arch ) {
	return architectures[ arch ] || arch;
}

const platforms = {
	linux: "Linux",
	darwin: "Mac"
};

function platform( plat ) {
	return platforms[ plat ] || plat;
}

function buildNumber( build ) {
	return padLeft( build.substr( 1 ), 4, "0" );
}

function slug( { owner, project, slug } ) {
	return <a href={ `https://github.com/${owner}/${project}/commit/${slug}` }>
		{ slug }
	</a>;
}

export default React.createClass( {
	propTypes: {
		className: React.PropTypes.string,
		versions: React.PropTypes.object.isRequired
	},
	getDefaultProps() {
		return {
			className: ""
		};
	},
	renderBuildGroup( { packages }, build ) {
		const packagesCount = packages.length;
		return ( map( packages, ( p, index ) => {
			return (
				<tr key={ p.file }>
					{ index === 0 ? <td rowSpan={ packagesCount }>{ buildNumber( build ) }</td> : null }
					<td>{ platform( p.platform ) }</td>
					<td>{ architecture( p.architecture ) }</td>
					<td>{ slug( p ) }</td>
					<td><em className="text-muted">Not Released</em></td>
				</tr>
			);
		} ) );
	},
	renderVersionGroup( { builds }, versionNumber ) {
		const latestBuild = Object.keys( builds )[ 0 ];
		return (
			<div className="row" key={ versionNumber } >
				<div className="col-md-12">
					<div className="nav-tabs-custom">
						<ul className="nav nav-tabs pull-right ui-sortable-handle bg-shaded">
							<li className="active"><a href="#sales-chart" data-toggle="tab">All Builds</a></li>
							<li className="pull-left header">
								<h3 className="header-in-tab">
									v{ versionNumber } <small title="Latest Build Number" className="text-muted">{ buildNumber( latestBuild ) }</small>
								</h3>
							</li>
						</ul>
						<div className="tab-content no-padding">
							<table className="table table-striped no-padding">
								<thead>
									<tr>
										<th scope="col" width="10%">Build Number</th>
										<th scope="col">Platform</th>
										<th scope="col">Architecture</th>
										<th scope="col">Slug</th>
										<th scope="col">Release</th>
									</tr>
								</thead>
								<tbody>
									{ flatten( map( builds, this.renderBuildGroup ) ) }
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	},
	render() {
		return (
			<section className={ this.props.className }>
				{ map( this.props.versions, this.renderVersionGroup ) }
			</section>
		);
	}
} );
