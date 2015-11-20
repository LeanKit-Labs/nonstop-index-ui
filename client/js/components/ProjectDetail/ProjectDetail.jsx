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
			deployChoice: projectStore.getDeployChoice
		}
	);
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "viewProject", "viewHost", "applySettings" ],
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
									onDeploy={ this.applySettings } />
							</div>
							<div className="col-md-4">
								<HostList hosts={ this.state.hosts } onSelectHost={ this.viewHost } />
							</div>
						</div>
					</section>
					<Modal show={ this.state.showModal } onHide={ this.close }>
					      <Modal.Header>
					        <Modal.Title>Confirm Deployment</Modal.Title>
					      </Modal.Header>

					      <Modal.Body>
					        <h3>Package to Deploy</h3>
					        <span>{ this.state.selectedPackage.branch }</span> | <span>Build Number</span> | <span>{ this.state.selectedPackage.version }</span>
					        <hr />
					        <h3>Hosted Package</h3>
					        <span>{ this.state.selectedHost.branch }</span> | <span>Build Number</span> | <span>Version</span>
					      </Modal.Body>

					      <Modal.Footer>
					        <Button onClick={ this.modalClose }>Cancel</Button>
					        <Button bsStyle="primary">Deploy</Button>
					      </Modal.Footer>

					    </Modal>
			</div>
		);
	}
} );
