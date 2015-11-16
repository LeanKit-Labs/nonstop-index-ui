import "babel/polyfill";
import "modernizr";
import config from "./clientConfig";
import lux from "lux.js";
import luxAh from "lux-autohost";
import window from "window";
import postal from "postal";

/* istanbul ignore next only used for development */
if ( DEBUG ) {
	window.lux = lux;
	window.luxAh = luxAh;
	window.postal = postal;
}

window.NS = ( window.NS || {} );
window.NS[ config.appName ] = config.version;

// polyfill window.location.origin used in API calls for IE < 11
if ( !window.location.origin ) {
	window.location.origin = window.location.protocol + "//" + window.location.host;
}

// produces client-side metrics key
lux.getContextKey = function() {
	var args = Array.prototype.slice.call( arguments, 0 );
	var path;
	path = window.location.pathname.replace( /\//ig, "-" );
	path = path[ 0 ] === "-" ? path.slice( 1 ) : path;
	return ( [ "web", path ].concat( args ) ).join( "." );
};

lux.getLogNamespace = function() {
	return config.key;
};

luxAh.config( config.luxAutohost );

require( "./app" );
