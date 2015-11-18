import React from "react";
import "./Avatar.less";

export default React.createClass( {
	propTypes: {
		owner: React.PropTypes.string,
		size: React.PropTypes.number
	},
	getDefaultProps() {
		return {
			owner: "anonymous",
			size: 16
		};
	},
	render() {
		return (
			<img className="avatar" src={ `https://avatars.githubusercontent.com/${ this.props.owner }?s=${ this.props.size }` } />
		);
	}
} );
