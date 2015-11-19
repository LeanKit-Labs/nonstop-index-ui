import React from "react";
import "./Avatar.less";

export default React.createClass( {
	propTypes: {
		className: React.PropTypes.string,
		owner: React.PropTypes.string,
		size: React.PropTypes.number
	},
	getDefaultProps() {
		return {
			owner: "anonymous",
			size: 16,
			className: "avatar"
		};
	},
	render() {
		return (
			<img className={ this.props.className } src={ `https://avatars.githubusercontent.com/${ this.props.owner }?s=${ this.props.size }` } />
		);
	}
} );
