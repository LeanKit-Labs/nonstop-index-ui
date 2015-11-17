import React from "react";
import lux from "lux.js";

import projectStore from "stores/projectStore";

import "./ProjectDetail.less";

function getState() {
	return projectStore.getState();
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "exampleAction" ],
	stores: {
		listenTo: [ "project" ],
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
	render() {
		return (
			<div></div>
		);
	}
} );
