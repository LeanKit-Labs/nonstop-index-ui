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
	onProjectClick( project, e ) {
		e.preventDefault();
		this.props.onSelectProject( project );
	},
	renderProjects() {
		return this.props.projects.map( project => (
			<a key={ project.name } href={ `/nonstop/project/${project.name}/${project.owner}/${project.branch}` } onClick={ this.onProjectClick.bind( this, project ) } className="list-group-item">
				<h3 className="list-group-item-heading"><span>{ project.name }</span></h3>
				<p className="list-group-item-text text-muted">
					<Avatar owner={ project.owner } />
					<i className="fa fa-code-fork"></i> <strong>{ project.owner }/{ project.branch }</strong>
				</p>
			</a>
		) );
	},
	render() {
		return (
			<div className="box box-primary">
				<div className="box-header bg-info">
					<h3 className="box-title text-primary"><i className="fa fa-bookmark"></i> { this.props.title }</h3>
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
