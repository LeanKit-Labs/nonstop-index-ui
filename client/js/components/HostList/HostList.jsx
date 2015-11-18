import React from "react";
import Avatar from "Avatar";
import "./HostList.less";

export default React.createClass( {
	propTypes: {
		hosts: React.PropTypes.array.isRequired,
		onSelectHost: React.PropTypes.func.isRequired,
		title: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			title: "Hosts",
			hosts: []
		};
	},
	renderHost( host ) {
		return (
			<tr key={ host.name }>
				<td>{ host.name }</td>
				<td>
					<Avatar owner={ host.owner } />
					<i className="fa fa-code-fork"></i> { host.owner }/{ host.projectName }/{ host.branch }
				</td>
				<td>{ host.hostName }</td>
				<td>{ host.ip }</td>
			</tr>
		);
	},
	renderHosts() {
		return (
			<div className="row">
				<div className="col-md-12">
					<table className="table table-striped no-padding">
						<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Branch</th>
							<th scope="col">Hostname</th>
							<th scope="col">IP</th>
						</tr>
						</thead>
						<tbody>
						{ this.props.hosts.map( this.renderHost ) }
						</tbody>
					</table>
				</div>
			</div>
		);

		//return this.props.hosts.map( host => {
		//	return <a key={ host.name } onClick={ this.props.onSelectHost.bind( null, host ) } className="list-group-item">
		//		<h3 className="list-group-item-heading"><span>{ host.name }</span></h3>
		//		<p className="list-group-item-text text-muted">
		//			<i className="fa fa-code-fork"></i> <strong>{ host.owner }/{ host.projectName }/{ host.branch }</strong>
		//		</p>
		//	</a>;
		//} );
	},
	render() {
		return (
			<div className="box box-primary">
				<div className="box-header">
					<h3 className="box-title">{ this.props.title }</h3>
				</div>
				<div className="box-body no-padding">
					<div className="list-group list-full-width">
						{ this.renderHosts() }
					</div>
				</div>
			</div>
		);
	}
} );
