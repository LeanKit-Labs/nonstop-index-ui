module.exports = function( session, config ) {
	var sessionStore;
	if ( config && config.redis && config.redis.enabled ) {
		var redis = require( "redis" ).createClient( config.redis.port, config.redis.host );
		var RedisStore = require( "connect-redis" )( session );
		sessionStore = new RedisStore( { client: redis, prefix: config.redis.prefix || "ah" } );
	}
	return sessionStore;
};
