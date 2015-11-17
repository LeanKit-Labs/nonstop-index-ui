import React from "react";
import lux from "lux.js";
import projectStore from "stores/projectStore";

import "./ProjectDetail.less";

function getState( { name, owner, branch } ) {
	return projectStore.getProject( name, owner, branch );
}

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator, lux.reactMixin.store ],
	getActions: [ "exampleAction" ],
	stores: {
		listenTo: [ "project" ],
		onChange() {
			this.setState( getState( this.props.params ) );
		}
	},
	propTypes: {
		params: React.PropTypes.shape( {
			name: React.PropTypes.string.isRequired,
			owner: React.PropTypes.string.isRequired,
			branch: React.PropTypes.string.isRequired
		} )
	},
	getDefaultProps() {
		return { params: {} };
	},
	getInitialState() {
		return getState( this.props.params );
	},
	componentWillReceiveProps( newProps ) {
		this.setState( getState( newProps.params ) );
	},
	render() {
		return (
			<section className="content">
				<div className="row">
					<div className="col-md-12">
						<div className="nav-tabs-custom">
							<ul className="nav nav-tabs pull-right ui-sortable-handle">
								<li className="active"><a href="#sales-chart" data-toggle="tab">All Builds</a></li>
								<li className="pull-left header">
								<h3 className="header-in-tab">v1.4.3 <small title="Build Number" className="text-muted">5142</small></h3></li>
							</ul>
							<div className="tab-content no-padding">
								<table className="table table-striped no-padding">
									<thead>
										<tr>
											<th scope="col" width="10%">Build Number</th>
											<th scope="col">Platform</th>
											<th scope="col">Architecture</th>
											<th scope="col">Release</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td rowSpan="4">5142
											</td><td>Windows</td>
											<td>32 bit</td>
											<td><div className="btn-group">
													<button className="btn btn-sm btn-default btn-soft-success">Released</button>
													<button className="btn btn-sm btn-default btn-soft-success btn-danger-on-hover"><i className="fa fa-close"></i></button>
												</div></td>
										</tr>
										<tr>
											<td>Windows</td>
											<td>64 bit</td>
											<td><div className="btn-group">
													<button className="btn btn-sm btn-default btn-soft-success">Released</button>
													<button className="btn btn-sm btn-default btn-soft-success btn-danger-on-hover"><i className="fa fa-close"></i></button>
												</div></td>
										</tr>
										<tr>
											<td>Linux</td>
											<td>32 bit</td>
											<td><button className="btn btn-sm btn-default">Release</button></td>
										</tr>
										<tr>
											<td>Linux</td>
											<td>64 bit</td>
											<td><div className="btn-group">
													<button className="btn btn-sm btn-default btn-soft-success">Released</button>
													<button className="btn btn-sm btn-default btn-soft-success btn-danger-on-hover"><i className="fa fa-close"></i></button>
												</div></td>
										</tr>
										<tr>
											<td rowSpan="4">5141
											</td><td>Windows</td>
											<td>32 bit</td>
											<td><em className="text-muted">Not Released</em></td>
										</tr>
										<tr>
											<td>Windows</td>
											<td>64 bit</td>
											<td><em className="text-muted">Not Released</em></td>
										</tr>
										<tr>
											<td>Linux</td>
											<td>32 bit</td>
											<td><button className="btn btn-sm btn-default">Release</button></td>
										</tr>
										<tr>
											<td>Linux</td>
											<td>64 bit</td>
											<td><em className="text-muted">Not Released</em></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
} );
