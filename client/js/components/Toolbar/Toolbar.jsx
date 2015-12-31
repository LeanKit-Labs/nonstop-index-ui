import React from "react";
import lux from "lux.js";

import layoutStore from "stores/layoutStore";
import userStore from "stores/userStore";
import Logo from "Logo";
import { featureOptions } from "../../clientConfig";

import Dropdown from "react-bootstrap/lib/Dropdown";
import Avatar from "Avatar";

import "./Toolbar.less";

function getState() {
	return Object.assign(
		{ user: userStore.getUser() },
		layoutStore.getState()
	);
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "viewHome", "viewConfigurator" ],
	stores: {
		listenTo: [ "layout", "user" ],
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
	onHomeClick( e ) {
		e.preventDefault();
		this.viewHome();
	},
	onConfigureClick( e ) {
		e.preventDefault();
		this.viewConfigurator();
	},
	renderConfig() {
		return (
			<li className="dropdown messages-menu">
				<a ref="configLink" href="/nonstop/host/configure" onClick={ this.onConfigureClick } className="dropdown-toggle" data-toggle="dropdown">
					<i className="fa fa-cogs"></i> <span className="u-hiddenVisually">Configuration</span>
				</a>
			</li>
		);
	},
	renderUser() {
		const AVATAR_SIZE_SMALL = 50;
		const AVATAR_SIZE_LARGE = 180;

		return (
			<Dropdown componentClass="li" bsStyle={ null } className="user user-menu" id="userDropdown">
				<Dropdown.Toggle bsStyle={ null } useAnchor={ true } className="dropdown-toggle" noCaret={ true }>
					<Avatar owner={ this.state.user.username } className="user-image" size={ AVATAR_SIZE_SMALL } />
					<span className="hidden-xs">{ this.state.user.displayName }</span>
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<li className="user-header">
						<Avatar owner={ this.state.user.username } size={ AVATAR_SIZE_LARGE } className="img-circle" alt="User Image" />
						<p>
							{ this.state.user.displayName }
							<small>{ this.state.user.company }</small>
						</p>
					</li>
					<li className="user-footer">
						<div className="pull-left">
							<a href={ this.state.user.profileUrl } className="btn btn-default btn-flat">Profile</a>
						</div>
						<div className="pull-right">
							<a href="/nonstop/auth/logout" className="btn btn-default btn-flat">Sign out</a>
						</div>
					</li>
				</Dropdown.Menu>
			</Dropdown>
		);
	},
	render() {
		return (
			<header className="main-header">
				<a onClick={ this.onHomeClick } href="/nonstop" className="logo">
					<Logo />
				</a>
				<nav className="navbar navbar-inverse navbar-static-top" role="navigation">
					<div className="navbar-custom-menu">
						<ul className="nav navbar-nav">
							<li className="dropdown messages-menu">
								<a onClick={ this.onHomeClick } href="/nonstop" className="dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-dashboard"></i> Dashboard
								</a>
							</li>
							{ this.renderUser() }
							{ featureOptions.config ? this.renderConfig() : null }
						</ul>
					</div>
				</nav>
			</header>
		);
	}
} );
