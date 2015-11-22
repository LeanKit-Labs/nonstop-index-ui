require( "babel/register" );

var config = require( "./config" );
var pkg = require( "../package.json" );
var fount = require( "fount" );
var log = require( "./config/log" );
var postal = require( "postal" );
var pubsub = postal.channel( "ahpubsub" );

// note: order of registrations matter!
fount.register( "config", config );
fount.register( "postal", require( "postal" ) );
fount.register( "loggingCollectorConfig", config.logging );
fount.register( "ahpubsub", pubsub );

module.exports = require( "./init" )( {
	fount: fount,
	pkg: pkg,
	log: log,
	config: config
} );
