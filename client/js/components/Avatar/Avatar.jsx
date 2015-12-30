import React from "react";
import "./Avatar.less";

const AVATAR_SIZE = 16;
const Avatar = ( { className = "avatar", owner = "anonymous", size = AVATAR_SIZE } ) => {
	const src = `https://avatars.githubusercontent.com/${ owner }?s=${ size }`;
	return <img className={ className } src={ src } />;
};

Avatar.propTypes = {
	className: React.PropTypes.string,
	owner: React.PropTypes.string,
	size: React.PropTypes.number
};

export default Avatar;
