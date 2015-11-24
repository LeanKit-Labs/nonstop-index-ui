import React from "react";
import lux from "lux.js";
import configurationStore from "stores/configurationStore";
import projectStore from "stores/projectStore";
import OptionsDropdown from "OptionsDropdown";
import Switch from "react-bootstrap-switch";

import "react-bootstrap-switch/src/less/bootstrap3/build.less";
import "./HostConfigurator.less";

function getState() {
	return Object.assign( {}, configurationStore.getOptions(), {
		applyEnabled: configurationStore.getApplyEnabled(),
		hosts: projectStore.getHosts()
	} );
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "applySettings", "configureHost", "selectProject", "selectOwner", "selectBranch", "selectVersion", "selectHost", "setReleaseOnly" ],
	stores: {
		listenTo: [ "configuration", "project" ],
		onChange() {
			this.setState( getState() );
		}
	},
	getInitialState() {
		return getState();
	},
	componentWillUpdate( props, state ) {
		// react-bootstrap-switch does not change on props updates (state prop is just initial value)
		this.refs.releaseOnlySwitch.value( state.releaseOnly );
	},
	render() {
		const state = this.state;
		return (
			<div>
				<section className="content-header">
					<h1 className="text-primary">
						<i className="fa fa-cogs"></i> Host Configuration
					</h1>
					<ol className="breadcrumb">
						<li className="active"><i className="fa fa-cogs"></i> Host Configuration</li>
					</ol>
				</section>
				<section className="content">
					<div className="box box-primary">
						<div className="box-header with-border">
							<h3 className="box-title">Configuration Settings</h3>
						</div>
						<div className="box-body">
							<OptionsDropdown name="host" selected={ state.selectedHost } options={ state.hosts } onSelect={ this.selectHost } />
							<OptionsDropdown name="project" selected={ state.selectedProject } options={ state.projects } onSelect={ this.selectProject } />
							<OptionsDropdown name="owner" selected={ state.selectedOwner } options={ state.owners } onSelect={ this.selectOwner } />
							<OptionsDropdown name="branch" selected={ state.selectedBranch } options={ state.branches } onSelect={ this.selectBranch } />
							<OptionsDropdown name="version" selected={ state.selectedVersion } options={ state.versions } onSelect={ this.selectVersion } />
							<div className="form-group">
								<label className="u-block">Release Only</label>
								<Switch ref="releaseOnlySwitch" wrapperClass="hostConfigurator-releaseOnlySwitch" size="small" state={ state.releaseOnly } onChange={ this.setReleaseOnly } />
							</div>
						</div>
						<div className="box-footer">
							<button disabled={ !this.state.applyEnabled } onClick={ this.applySettings.bind( this, null ) } type="submit" className="btn btn-primary">Apply Settings</button>
						</div>
					</div>
				</section>
			</div>
		);
	}
} );
