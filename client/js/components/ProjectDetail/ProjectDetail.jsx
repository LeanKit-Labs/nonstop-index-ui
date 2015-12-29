import React from "react";
import ProjectDetailHeader from "ProjectDetailHeader";
import VersionGroup from "VersionGroup";
import lux from "lux.js";
import projectStore from "stores/projectStore";
import HostList from "HostList";
import { Modal, Button, Table } from "react-bootstrap/lib";

import "./ProjectDetail.less";

function getState( { name, owner, branch } ) {
	return Object.assign(
		{},
		projectStore.getProject( name, owner, branch ),
		{
			deployChoice: projectStore.getDeployChoice(),
			releaseChoice: projectStore.getReleaseChoice()
		}
	);
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [
		"viewProject",
		"viewHost",
		"finalizeDeploy",
		"loadHostStatus",
		"triggerDeploy",
		"cancelDeploy",
		"releasePackage",
		"confirmReleasePackage",
		"cancelReleasePackage"
	],
	stores: {
		listenTo: [ "project" ],
		onChange() {
			this.setState( getState( this.props.params ) );
		}
	},
	propTypes: {
		params: React.PropTypes.shape( {
			name: React.PropTypes.string.isRequired,
			owner: React.PropTypes.string.isRequired,
			branch: React.PropTypes.string.isRequired
		} )
	},
	getDefaultProps() {
		return { params: {} };
	},
	getInitialState() {
		return getState( this.props.params );
	},
	componentWillReceiveProps( newProps ) {
		this.setState( getState( newProps.params ) );
	},
	onSelectBranch( branchName ) {
		const params = this.props.params;
		this.viewProject( {
			name: params.name,
			owner: params.owner,
			branch: branchName
		} );
	},
	onSelectOwner( owner ) {
		const params = this.props.params;
		const branch = owner.branches.includes( params.branch ) ? params.branch : owner.branches[ 0 ];
		this.viewProject( {
			name: params.name,
			owner: owner.name,
			branch: branch
		} );
	},
	onDeploy( { pkg, host } ) {
		this.loadHostStatus( host );
		this.triggerDeploy( { pkg, host } );
	},
	renderDeployModal() {
		const deployChoice = this.state.deployChoice || {} ;
		const { pkg, host } = deployChoice;
		return (
			<Modal key="deployModal" show={ !!this.state.deployChoice } onHide={ this.cancelDeploy }>
				<Modal.Header>
					<Modal.Title>Confirm Deployment to <span className="projectDetail-modal-title-hostName">{ host ? host.name : "" }</span></Modal.Title>
				</Modal.Header>

				{ this.state.deployChoice ? <Modal.Body>
					{ this.state.deployChoice.error ? <div className="callout callout-danger">
						<p>{ this.state.deployChoice.error }</p>
					</div> : null }
					<table className="table">
						<thead>
							<tr>
								<th scope="col"></th>
								<th scope="col">Hosted Package</th>
								<th scope="col">Package to Deploy</th>
							</tr>
						</thead>
						<tbody>
							{ this.renderCompareRow( "Project", host.project, pkg.project ) }
							{ this.renderCompareRow( "Owner", host.owner, pkg.owner ) }
							{ this.renderCompareRow( "Branch", host.branch, pkg.branch ) }
							{ this.renderCompareRow( "Version", host.version ? host.version : "...", pkg.version ) }
						</tbody>
					</table>
				</Modal.Body> : null }

				<Modal.Footer>
					<Button onClick={ this.cancelDeploy }>Cancel</Button>
					<Button bsStyle="primary" disabled={ !host || !host.status } onClick={ this.finalizeDeploy }>Deploy</Button>
				</Modal.Footer>
			</Modal>
		);
	},
	renderReleaseModal() {
		const releaseChoice = this.state.releaseChoice || {} ;
		const { project, owner, branch, slug, architecture, platform, version } = releaseChoice;
		return (
			<Modal key="releaseModal" bsSize="small" keyboard show={ !!this.state.releaseChoice } onHide={ this.cancelReleasePackage }>
				<Modal.Header>
					<Modal.Title>Confirm Release</Modal.Title>
				</Modal.Header>

				{ this.state.releaseChoice ? <Modal.Body>
					<Table striped condensed className="table">
						<tbody>
							<tr>
								<th scope="row">Project</th>
								<td>{ project }</td>
							</tr>
							<tr>
								<th scope="row">Owner</th>
								<td>{ owner }</td>
							</tr>
							<tr>
								<th scope="row">Branch</th>
								<td>{ branch }</td>
							</tr>
							<tr>
								<th scope="row">Platform</th>
								<td>{ platform }</td>
							</tr>
							<tr>
								<th scope="row">Architecture</th>
								<td>{ architecture }</td>
							</tr>
							<tr>
								<th scope="row">Version</th>
								<td>{ version }</td>
							</tr>
							<tr>
								<th scope="row">Slug</th>
								<td>{ slug }</td>
							</tr>
						</tbody>
					</Table>
				</Modal.Body> : null }

				<Modal.Footer>
					<Button onClick={ this.cancelReleasePackage }>Cancel</Button>
					<Button bsStyle="primary" onClick={ this.releasePackage.bind( this, releaseChoice ) }>Release</Button>
				</Modal.Footer>
			</Modal>
		);
	},
	renderCompareRow( label, oldValue, newValue ) {
		const matches = oldValue === newValue;
		return (
			<tr>
				<th scope="row">{ label }</th>
				<td className={ matches ? "" : "bg-danger" }>{ oldValue }</td>
				<td className={ matches ? "" : "bg-success" }>{ newValue }</td>
			</tr>
			);
	},
	render() {
		return (
			<div className="projectDetail">
				<ProjectDetailHeader
					{ ...this.props.params }
					className="content-header"
					owners={ this.state.owners }
					branches={ this.state.branches }
					onSelectOwner={ this.onSelectOwner }
					onSelectBranch={ this.onSelectBranch } />
					<section className="content">
						<div className="row">
							<div className="col-md-8">
								<VersionGroup
									versions={ this.state.versions }
									hosts={ this.state.hosts }
									onDeploy={ this.onDeploy }
									onRelease={ this.confirmReleasePackage } />
							</div>
							<div className="col-md-4">
								<HostList
									noHostsMessage="No hosts are configured to run this project."
									hosts={ this.state.hosts }
									onSelectHost={ this.viewHost } />
							</div>
						</div>
					</section>
					{ this.renderDeployModal() }
					{ this.renderReleaseModal() }
			</div>
		);
	}
} );
