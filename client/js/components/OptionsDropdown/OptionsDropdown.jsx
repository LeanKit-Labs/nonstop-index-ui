import React from "react";
import Dropdown from "react-bootstrap/lib/Dropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";
import { capitalize } from "lodash";

import "./OptionsDropdown.less";

function getName( value ) {
	return value && typeof value === "object" ? value.name : value;
}

const OptionsDropdown = ( { name, selected, options, onSelect } ) => {
	const manyOptions = options.length > 1;
	const id = `${ name }Dropdown`;

	return (
		<div className="form-group">
			<label className="u-block" htmlFor={ id }>{ capitalize( name ) }</label>
			<Dropdown bsStyle="default" id={ id }>
				<Dropdown.Toggle disabled={ !manyOptions } noCaret={ !manyOptions }>
					<i className="fa fa-book"></i> { getName( selected ) }
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{ options.map( option => {
						return <MenuItem key={ getName( option ) } onSelect={ onSelect.bind( undefined, option ) }>{ getName( option ) }</MenuItem>;
					} ) }
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

OptionsDropdown.propTypes = {
	name: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	options: React.PropTypes.array,
	selected: React.PropTypes.oneOfType( [
		React.PropTypes.object,
		React.PropTypes.string
	] )
};

export default OptionsDropdown;
