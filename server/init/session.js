var RedisFactory = require( "redis" );
var connectRedisFactory = require( "connect-redis" );

module.exports = function( session, config ) {
	var sessionStore;
	if ( config && config.redis && config.redis.enabled ) {
		var redis = RedisFactory.createClient( config.redis.port, config.redis.host );
		var RedisStore = connectRedisFactory( session );
		sessionStore = new RedisStore( { client: redis, prefix: config.redis.prefix || "ah" } );
	}
	return sessionStore;
};
