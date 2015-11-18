import React from "react";
import "./HostList.less";
import lux from "lux.js";
import { flatten } from "lodash";

export default React.createClass( {
	mixins: [ lux.reactMixin.actionCreator ],
	getActions: [ "loadHostStatus" ],
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
	renderHost( host, i ) {
		return ( [
			<tr key={ `${host.name}-${i}` }>
				<td rowSpan="4" ><strong>{ host.name }</strong><br />{ host.ip }</td>
				<td><i className="fa text-primary fa-fw fa-bookmark"></i> { host.projectName }</td>
			</tr>,
			<tr key={ `${host.name}-branch-${i}` }>
				<td><i className="fa text-green fa-fw fa-code-fork"></i> { host.owner }/{ host.branch }</td>
			</tr>,
			<tr key={ `${host.name}-name-${i}` }>
				<td><i className="fa text-purple fa-fw fa-server"></i> { host.hostName }</td>
			</tr>,
			<tr key={ `${host.name}-status-${i}` }>
				<td>{ this.renderStatus( host ) }</td>
			</tr>
		] );
	},
	renderStatus( host ) {
		if ( !host.status ) {
			return <button className="btn btn-default btn-small" onClick={ this.loadHostStatus.bind( this, host.name ) }>Get Status</button>;
		} else {
			return (
				<div>
					<strong>Host Uptime</strong> { host.status.hostUptime }<br />
					<strong>Service Uptime</strong> { host.status.serviceUptime }<br />
					<strong>Slug</strong> { host.status.slug }<br />
					<strong>Version</strong> { host.status.version }
				</div>
			);
		}
	},
	renderHosts() {
		return (
			<div className="row">
				<div className="col-md-12">
					<table className="table no-padding">
						<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Details</th>
						</tr>
						</thead>
						<tbody>
						{ flatten( this.props.hosts.map( this.renderHost ) ) }
						</tbody>
					</table>
				</div>
			</div>
		);
	},
	render() {
		return (
			<div className="box box-primary">
				<div className="box-header bg-info">
					<h3 className="box-title text-primary"><i className="fa fa-server"></i> { this.props.title }</h3>
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
