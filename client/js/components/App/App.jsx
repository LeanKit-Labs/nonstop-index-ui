import React from "react";
import { RouteHandler } from "react-router";
import lux from "lux.js";
import "./App.less";
import Toolbar from "Toolbar";
import { get as _get } from "lodash";
import win from "window";

function getState() {
	return {
		initialized: true
	};
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator ],
	getActions: [ "initializePage" ],
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
	render: function() {
		if ( this.state.initialized ) {
			return (
				<div className="skin-blue">
					<Toolbar />
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
