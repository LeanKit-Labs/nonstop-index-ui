import React from "react";
import lux from "lux.js";
import configurationStore from "stores/configurationStore";
import projectStore from "stores/projectStore";
import OptionsDropdown from "OptionsDropdown";
import Input from "react-bootstrap/lib/Input";

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
	getActions: [ "applySettings", "configureHost", "selectProject", "selectOwner", "selectBranch", "selectVersion", "selectHost", "setPull" ],
	stores: {
		listenTo: [ "configuration", "project" ],
		onChange() {
			this.setState( getState() );
		}
	},
	getInitialState() {
		return getState();
	},
	handlePullBuild( pullBuild ) {
		this.setPull( pullBuild );
		//this.setState({ pullBuild });
	},
	render() {
		const state = this.state;
		console.log(state);
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

							<div className="form-group row">
								<div className="col-sm-2">
									<strong className="u-block">Pull Builds For:</strong>
									<Input id="version" type="radio" label="Single Build" name="version" checked={ state.pullBuild === "SingleBuild" } onChange={ this.handlePullBuild.bind( this, "SingleBuild" ) } />
									<Input type="radio" label="Latest Build" name="version" checked={ state.pullBuild === "LatestBuild" } onChange={ this.handlePullBuild.bind( this, "LatestBuild" ) } />
									<Input type="radio" label="Release Only" name="version" checked={ state.pullBuild === "ReleaseOnly" } onChange={ this.handlePullBuild.bind( this, "ReleaseOnly" ) } />
								</div>
								<div className="col-sm-10">
									<OptionsDropdown name="version" selected={ state.selectedVersion } options={ state.versions } onSelect={ this.selectVersion } />
								</div>
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
