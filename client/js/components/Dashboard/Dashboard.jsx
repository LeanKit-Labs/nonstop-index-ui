import React from "react";

import lux from "lux.js";
import projectStore from "stores/projectStore";
import ProjectList from "ProjectList";
import HostList from "HostList";
import "./Dashboard.less";

function getState() {
	return {
		projects: projectStore.getProjects(),
		hosts: projectStore.getHosts()
	};
}

export default React.createClass( {
	mixins: [ lux.reactMixin.store, lux.reactMixin.actionCreator ],
	stores: {
		listenTo: "project",
		onChange() {
			this.setState( getState() );
		}
	},
	getActions: [ "viewProject", "viewHost" ],
	getDefaultProps() {
		return {};
	},
	getInitialState() {
		return getState();
	},
	render() {
		return (
			<div>
				<section className="content-header">
					<h1 className="text-primary">
						<i className="fa fa-dashboard"></i> Dashboard
					</h1>
					<ol className="breadcrumb">
						<li className="active"><i className="fa fa-dashboard"></i> Dashboard</li>
					</ol>
				</section>
				<section className="content">
					<div className="row">
						<div className="col-md-6">
							<ProjectList projects={ this.state.projects } onSelectProject={ this.viewProject } />
						</div>
						<div className="col-md-6">
							<HostList hosts={ this.state.hosts } onSelectHost={ this.viewHost } />
						</div>
					</div>
				</section>
			</div>
		);
	}
} );
