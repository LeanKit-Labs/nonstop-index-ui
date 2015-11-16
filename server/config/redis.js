var redis = require( "redis" );
var when = require( "when" );
var log = require( "./log" )( "r0.redis" );

module.exports = function( service, config ) {
	var client, host, port;
	var cfg = {};
	if ( service && service.redis ) {
		host = service.redis.host;
		port = service.redis.port;
	} else if ( config && config.redis ) {
		host = service.redis.host;
		port = service.redis.port;
	} else {
		host = service.Address;
		port = service.Port;
		cfg = config;
	}
	return when.promise( function( resolve, reject ) {
		client = redis.createClient( port, host, cfg );
		client.on( "error", function( err ) {
			log.error( "Could not establish a connection to redis: %s", err );
			reject( err );
		} );
		client.on( "connect", function() {
			resolve( client );
		} );
	} );
};
