import React from "react";

import lux from "lux.js";
import projectStore from "stores/projectStore";
import ProjectList from "ProjectList";
import "./Dashboard.less";

function getState() {
	return {
		projects: projectStore.getProjects()
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
	getActions: [ "viewProject" ],
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
					<ProjectList projects={ this.state.projects } onSelectProject={ this.viewProject } />
				</section>
			</div>
		);
	}
} );
