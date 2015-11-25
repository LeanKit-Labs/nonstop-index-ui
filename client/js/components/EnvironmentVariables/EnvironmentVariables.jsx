import React from "react";
import "./EnvironmentVariables.less";
import { Modal, Button, Table, Alert } from "react-bootstrap/lib";
import envVarStore from "stores/envVarStore";
import lux from "lux.js";

function getState() {
	return envVarStore.getEnvironmentInfo();
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [
		"clearEnvVarChoice"
	],
	stores: {
		listenTo: [ "environment" ],
		onChange() {
			this.setState( getState() );
		}
	},
	getDefaultProps() {
		return {};
	},
	getInitialState() {
		return getState();
	},
	renderVariables() {
		return ( <Modal.Body>
			<Table striped className="table">
				<thead>
					<tr>
						<th scope="row">Name</th>
						<th scope="row">Value</th>
					</tr>
				</thead>
				<tbody>
					{
						this.state.environmentVariables.map( ( { key, val } ) => {
							return ( <tr key={ key }>
								<th scope="row">{ key }</th>
								<td>{ val }</td>
							</tr> );
						} )
					}
				</tbody>
			</Table>
		</Modal.Body> );
	},
	renderNoVars() {
		return ( <Alert bsStyle="warning" className="u-textCenter environmentVariables-Notice--warning">
			No environment variables are set for this host.
		 </Alert> );
	},
	renderError() {
		return ( <Alert bsStyle="danger" className="u-textCenter environmentVariables-Notice--error">
			Unable to load environment information for this host.
		 </Alert> );
	},
	renderLoading() {
		return ( <div className="spinner">
			<i className="fa fa-3x fa-circle-o-notch fa-spin"></i>
		</div> );
	},
	renderBody() {
		if ( this.state.status === "loaded" ) {
			if ( this.state.environmentVariables.length ) {
				return this.renderVariables();
			} else {
				return this.renderNoVars();
			}
		} else if ( this.state.status === "loading" ) {
			return this.renderLoading();
		} else if ( this.state.status === "error" ) {
			return this.renderError();
		} else {
			return null;
		}
	},
	render() {
		return (
			<Modal key="envVarModal" className="environmentVariables" bsSize="large" keyboard show={ !!this.state.host } onHide={ this.clearEnvVarChoice }>
				<Modal.Header>
					<Modal.Title className="u-autoWidth">Environment Variables for <strong>{ this.state.host }</strong></Modal.Title>
				</Modal.Header>
				{ this.renderBody() }
				<Modal.Footer className="u-textCenter">
					<Button bsStyle="primary" onClick={ this.clearEnvVarChoice }>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
} );
