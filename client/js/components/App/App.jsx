import React from "react";
import { RouteHandler } from "react-router";
import lux from "lux.js";
import "./App.less";
import Toolbar from "Toolbar";

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
	componentDidMount: function() {
		this.initializePage( {} );
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
