import React from "react";
import lux from "lux.js";
import configurationStore from "stores/configurationStore";
import "./HostConfigurator.less";
import Dropdown from "react-bootstrap/lib/Dropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";

function getState() {
	return Object.assign( {}, configurationStore.getOptions(), { applyEnabled: configurationStore.getApplyEnabled() } );
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "configureHost", "selectProject", "selectOwner", "selectBranch", "selectVersion", "selectHost", "applySettings" ],
	stores: {
		listenTo: [ "configuration", "project" ],
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
	renderHostDropdown() {
		const manyHosts = this.state.hosts.length > 1;
		const selected = this.state.selectedHost;
		return (
			<div className="form-group">
				<label className="hostConfiguration-dropdownLabel" htmlFor="hostDropdown">Host</label>
				<Dropdown ref="hostDropdown" bsStyle="default" id="hostDropdown">
					<Dropdown.Toggle disabled={ !manyHosts } noCaret={ !manyHosts }>
						<i className="fa fa-book"></i> { selected && selected.name }
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{ this.state.hosts.map( host => {
						return <MenuItem key={ host.name } onSelect={ this.selectHost.bind( this, host ) }>{ host.name }</MenuItem>;
					} ) }
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	},
	renderProjectDropdown() {
		const manyProjects = this.state.projects.length > 1;
		const selected = this.state.selectedProject;
		return (
			<div className="form-group">
				<label className="hostConfiguration-dropdownLabel" htmlFor="projectDropdown">Project</label>
				<Dropdown bsStyle="default" id="projectDropdown">
					<Dropdown.Toggle disabled={ !manyProjects } noCaret={ !manyProjects }>
						<i className="fa fa-book"></i> { selected }
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{ this.state.projects.map( project => {
						return <MenuItem key={ project } onSelect={ this.selectProject.bind( this, project ) }>{ project }</MenuItem>;
					} ) }
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	},
	renderOwnerDropdown() {
		const manyOwners = this.state.owners.length > 1;
		const selected = this.state.selectedOwner;
		return (
			<div className="form-group">
				<label className="hostConfiguration-dropdownLabel" htmlFor="ownerDropdown">Owner</label>
				<Dropdown bsStyle="default" id="ownerDropdown">
					<Dropdown.Toggle disabled={ !manyOwners } noCaret={ !manyOwners }>
						<i className="fa fa-book"></i> { selected }
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{ this.state.owners.map( owner => {
						return <MenuItem key={ owner } onSelect={ this.selectOwner.bind( this, owner ) }>{ owner }</MenuItem>;
					} ) }
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	},
	renderBranchDropdown() {
		const manyBranches = this.state.branches.length > 1;
		const selected = this.state.selectedBranch;
		return (
			<div className="form-group">
				<label className="hostConfiguration-dropdownLabel" htmlFor="branchDropdown">Branch</label>
				<Dropdown bsStyle="default" id="branchDropdown">
					<Dropdown.Toggle disabled={ !manyBranches } noCaret={ !manyBranches }>
						<i className="fa fa-book"></i> { selected }
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{ this.state.branches.map( branch => {
						return <MenuItem key={ branch } onSelect={ this.selectBranch.bind( this, branch ) }>{ branch }</MenuItem>;
					} ) }
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	},
	renderVersionDropdown() {
		const manyVersions = this.state.versions.length > 1;
		const selected = this.state.selectedVersion;
		return (
			<div className="form-group">
				<label className="hostConfiguration-dropdownLabel" htmlFor="versionDropdown">Version</label>
				<Dropdown bsStyle="default" id="versionDropdown">
					<Dropdown.Toggle disabled={ !manyVersions } noCaret={ !manyVersions }>
						<i className="fa fa-book"></i> { selected }
					</Dropdown.Toggle>
					<Dropdown.Menu>
					{ this.state.versions.map( version => {
						return <MenuItem key={ version } onSelect={ this.selectVersion.bind( this, version ) }>{ version }</MenuItem>;
					} ) }
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	},
	render() {
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
						{ this.renderHostDropdown() }
						{ this.renderProjectDropdown() }
						{ this.renderOwnerDropdown() }
						{ this.renderBranchDropdown() }
						{ this.renderVersionDropdown() }
						</div>
						<div className="box-footer">
							<button disabled={ !this.state.applyEnabled } onClick={ this.applySettings } type="submit" className="btn btn-primary">Apply Settings</button>
						</div>
					</div>
				</section>
			</div>
		);
	}
} );
