import "babel/polyfill";
import "modernizr";
import config from "./clientConfig";
import lux from "lux.js";
import window from "window";
import postal from "postal";

/* istanbul ignore next only used for development */
if ( DEBUG ) {
	window.lux = lux;
	window.postal = postal;
}

window.NS = ( window.NS || {} );
window.NS[ config.appName ] = config.version;

// polyfill window.location.origin used in API calls for IE < 11
if ( !window.location.origin ) {
	window.location.origin = `${ window.location.protocol }//${ window.location.host }`;
}

require( "./app" );
