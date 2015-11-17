import React from "react";
import lux from "lux.js";

import layoutStore from "stores/layoutStore";
import Logo from "Logo";

import "./Toolbar.less";

function getState() {
	return layoutStore.getState();
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "viewHome" ],
	stores: {
		listenTo: [ "layout" ],
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
			<header className="main-header">

				<a onClick={ this.viewHome } className="logo">
					<Logo />
				</a>

				<nav className="navbar navbar-inverse navbar-static-top" role="navigation">

				</nav>
			</header>
		);
	}
} );
