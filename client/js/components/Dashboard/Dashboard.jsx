import React from "react";

import "./Dashboard.less";

export default React.createClass( {
	getDefaultProps() {
		return {};
	},
	getInitialState() {
		return {};
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

				</section>
			</div>
		);
	}
} );
