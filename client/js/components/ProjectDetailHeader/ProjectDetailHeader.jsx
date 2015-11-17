import React from "react";
import Dropdown from "react-bootstrap/lib/Dropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";

import "./ProjectDetailHeader.less";

export default React.createClass( {
	propTypes: {
		branch: React.PropTypes.string.isRequired,
		branches: React.PropTypes.array.isRequired,
		className: React.PropTypes.string,
		name: React.PropTypes.string.isRequired,
		onSelectBranch: React.PropTypes.func.isRequired,
		onSelectOwner: React.PropTypes.func.isRequired,
		owner: React.PropTypes.string.isRequired,
		owners: React.PropTypes.array.isRequired
	},
	getDefaultProps() {
		return {
			className: ""
		};
	},
	getInitialState() {
		return {};
	},
	onSelectOwner( owner ) {
		this.props.onSelectOwner( owner );
	},
	onSelectBranch( branch ) {
		this.props.onSelectBranch( branch );
	},
	renderOwnerDropdown() {
		const manyOwners = this.props.owners.length > 1;
		return (
			<Dropdown bsStyle="default" id="ownerDropdown">
				<Dropdown.Toggle disabled={ !manyOwners } noCaret={ !manyOwners }>
					<i className="fa fa-book"></i> { this.props.owner }
				</Dropdown.Toggle>
				<Dropdown.Menu>
				{ this.props.owners.map( owner => {
					return <MenuItem key={ owner.name } onSelect={ this.onSelectOwner.bind( this, owner ) }>{ owner.name }</MenuItem>;
				} ) }
				</Dropdown.Menu>
			</Dropdown>
		);
	},
	renderBranchDropdown() {
		const manyBranches = this.props.branches.length > 1;
		return (
			<Dropdown bsStyle="default" id="branchDropdown">
				<Dropdown.Toggle disabled={ !manyBranches } noCaret={ !manyBranches }>
					<i className="fa fa-code-fork"></i> branch: <strong>{ this.props.branch }</strong>
				</Dropdown.Toggle>
				<Dropdown.Menu>
				{ this.props.branches.map( branch => {
					return <MenuItem key={ branch } onSelect={ this.onSelectBranch.bind( this, branch ) }>{ branch }</MenuItem>;
				} ) }
				</Dropdown.Menu>
			</Dropdown>
		);
	},
	render() {
		return (
			<section className={ this.props.className }>
				<h1 className="projectDetailHeader-repoName">
					{ this.props.name }
				</h1>
				<div className="projectDetailHeader-metadata">
					{ this.renderOwnerDropdown() } { this.renderBranchDropdown() }
				</div>
			</section>
		);
	}
} );
