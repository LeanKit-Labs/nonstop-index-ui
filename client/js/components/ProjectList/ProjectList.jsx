import React from "react";
import Avatar from "Avatar";
import "./ProjectList.less";

export default React.createClass( {
	propTypes: {
		onSelectProject: React.PropTypes.func.isRequired,
		projects: React.PropTypes.array.isRequired,
		title: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			title: "Projects",
			projects: null
		};
	},
	renderProjects() {
		return this.props.projects.map( project => {
			return <a key={ project.name } onClick={ this.props.onSelectProject.bind( null, project ) } className="list-group-item">
				<h3 className="list-group-item-heading"><span>{ project.name }</span></h3>
				<p className="list-group-item-text text-muted">
					<Avatar owner={ project.owner } />
					<i className="fa fa-code-fork"></i> <strong>{ project.owner }/{ project.branch }</strong>
				</p>
			</a>;
		} );
	},
	render() {
		return (
			<div className="box box-primary">
				<div className="box-header">
					<h3 className="box-title">{ this.props.title }</h3>
				</div>
				<div className="box-body no-padding">
					<div className="list-group list-full-width">
						{ this.renderProjects() }
					</div>
				</div>
			</div>
		);
	}
} );
