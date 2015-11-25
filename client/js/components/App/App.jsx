import React from "react";
import { RouteHandler } from "react-router";
import lux from "lux.js";
import "./App.less";
import Toolbar from "Toolbar";
import { get as _get } from "lodash";
import win from "window";
import layoutStore from "stores/layoutStore";
import Alert from "react-bootstrap/lib/Alert";
import EnvironmentVariables from "EnvironmentVariables";

function getState() {
	return {
		initialized: true,
		alert: layoutStore.getAlert()
	};
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	stores: {
		listenTo: "layout",
		onChange() {
			this.setState( getState() );
		}
	},
	getActions: [ "initializePage", "handleAlertClose" ],
	getInitialState() {
		return getState();
	},
	componentDidUpdate: function( props, state ) {
		this.updateTitle();
	},
	componentDidMount: function() {
		this.updateTitle();
		this.initializePage( {} );
	},
	updateTitle() {
		const project = _get( this.props, "params.name", "Dashboard" );
		win.document.title = `${project} - Nonstop Index`;
	},
	renderLoader() {
		return (
			<div className="spinner">
				<i className="fa fa-3x fa-circle-o-notch fa-spin"></i>
			</div>
		);
	},
	renderAlert() {
		const alert = this.state.alert;
		return (
			<Alert className={ "app-alert u-textCenter" } bsStyle={ alert.type } onDismiss={ this.handleAlertClose } dismissAfter={ 5000 }>
				<p>{ alert.message }</p>
			</Alert>
		);
	},
	render: function() {
		if ( this.state.initialized ) {
			return (
				<div className="skin-blue">
					{ this.state.alert ? this.renderAlert() : null }
					<Toolbar />
					<EnvironmentVariables />
					<div className="wrapper">
						<RouteHandler />
					</div>
				</div>
			);
		} else {
			return this.renderLoader();
		}
	}
} );
