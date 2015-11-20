import React from "react";
import "./Avatar.less";

const Avatar = ( { className = "avatar", owner = "anonymous", size = 16 } ) => {
	const src = `https://avatars.githubusercontent.com/${ owner }?s=${ size }`;
	return <img className={ className } src={ src } />;
};

Avatar.propTypes = {
	className: React.PropTypes.string,
	owner: React.PropTypes.string,
	size: React.PropTypes.number
};

export default Avatar;
