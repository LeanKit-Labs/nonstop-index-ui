import React from "react";
import { padLeft, map, flatten } from "lodash";
import { ButtonGroup, Button, DropdownButton, MenuItem } from "react-bootstrap/lib";

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
		hosts: React.PropTypes.array,
		onDeploy: React.PropTypes.func.isRequired,
		onRelease: React.PropTypes.func.isRequired,
		versions: React.PropTypes.object.isRequired
	},
	getDefaultProps() {
		return {
			className: "versionGroup",
			hosts: []
		};
	},
	renderBuildGroup( { packages }, build ) {
		const packagesCount = packages.length;
		return ( map( packages, ( p, index ) => {
			return (
				<tr key={ p.file } className={ p.released ? "success" : "" }>
					{ index === 0 ? <td rowSpan={ packagesCount }>{ buildNumber( build ) }</td> : null }
					<td>{ platform( p.platform ) }</td>
					<td>{ architecture( p.architecture ) }</td>
					<td>{ slug( p ) }</td>
					<td>{ this.renderActions( p ) }</td>
					<td>
						{
							p.releasable ? <Button componentClass="a" bsStyle="success" onClick={ this.props.onRelease.bind( this, p ) } title="Release">
								<i className="fa fa-check-circle"></i> Release
							</Button> : ( p.released ? "Released" : "Not Released" )
						}
					</td>
				</tr>
			);
		} ) );
	},
	handleOnDeploy( pkg, event, host ) {
		this.props.onDeploy( { host, pkg } );
	},
	renderActions( pkg ) {
		return (
			<ButtonGroup>
				<DropdownButton bsStyle="default" className="btn-responsive" title="Deploy" id={ `dropdown-basic-${pkg.version}` } onSelect={ this.handleOnDeploy.bind( this, pkg ) }>
					{ this.props.hosts.map( host => <MenuItem key={ host.name } eventKey={ host.name }>{ host.name }</MenuItem> ) }
				</DropdownButton>
				<Button componentClass="a" href={ `/nonstop/package/${pkg.relative}/${pkg.file}` } title="Download">
					<i className="fa fa-cloud-download"></i>
					<span className="u-hiddenVisually">Download</span>
				</Button>
			</ButtonGroup>
		);
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
										<th scope="col" width="10%">Build #</th>
										<th scope="col">Plat&shy;form</th>
										<th scope="col">Archi&shy;tecture</th>
										<th scope="col">Slug</th>
										<th scope="col">Actions</th>
										<th scope="col" className="versionGroup-columnHeader">Release</th>
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
