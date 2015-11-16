import lux from "lux.js";
import window from "window";

var basePath = window.location.pathname.replace( /connections\/?$/, "" );
var endsWithSlash = /\/$/;
if ( !endsWithSlash.test( basePath ) ) {
	basePath += "/";
}

export default new lux.Store( {
	namespace: "navigation",
	state: {
		path: "connections",
		direction: "forward"
	},
	handlers: {
		placeHolderHandler: function() {}
	},
	getPath() {
		return this.getState().path;
	},
	getFullPath() {
		return basePath + this.getPath() + window.location.search;
	},
	getDirection() {
		return this.getState().direction;
	}
} );

