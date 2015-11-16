import React from "react";

import "./ProjectList.less";

export default React.createClass( {
	propTypes: {
		projects: React.PropTypes.object.isRequired,
		title: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			title: "Projects",
			projects: null
		};
	},
	getInitialState() {
		return {};
	},
	render() {
		return (
			<div className="box box-primary">
				<div className="box-header">
					<h3 className="box-title">{ this.props.title }</h3>
				</div>
				<div className="box-body no-padding">
					<div className="list-group list-full-width">
						{ this.props.projects.map( project => {
							return <a href="#" className="list-group-item">
								<h3 className="list-group-item-heading"><span>{ project.name }</span></h3>
							</a>;
						} ) }
					</div>
				</div>
			</div>
		);
	}
} );
