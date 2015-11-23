import React from "react";
import ProjectDetailHeader from "ProjectDetailHeader";
import VersionGroup from "VersionGroup";
import lux from "lux.js";
import projectStore from "stores/projectStore";
import HostList from "HostList";
import { Modal, Button } from "react-bootstrap/lib";

import "./ProjectDetail.less";

function getState( { name, owner, branch } ) {
	return Object.assign(
		{},
		projectStore.getProject( name, owner, branch ),
		{
			allHosts: projectStore.getHosts(),
			deployChoice: projectStore.getDeployChoice()
		}
	);
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "viewProject", "viewHost", "finalizeDeploy", "loadHostStatus", "triggerDeploy", "cancelDeploy" ],
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
	renderModal() {
		const deployChoice = this.state.deployChoice || {} ;
		const { pkg, host } = deployChoice;
		return (
			<Modal show={ !!this.state.deployChoice } onHide={ this.cancelDeploy }>
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
									hosts={ this.state.allHosts }
									onDeploy={ this.onDeploy } />
							</div>
							<div className="col-md-4">
								<HostList hosts={ this.state.hosts } onSelectHost={ this.viewHost } />
							</div>
						</div>
					</section>
					{ this.renderModal() }
			</div>
		);
	}
} );
