var _ = require( "lodash" );
var metronicFn = require( "metronic" );
var adapter = require( "metronic-rabbit" );
var metronic;

function configure( configuration ) {
	if ( !metronic ) {
		metronic = metronicFn( {
			prefix: configuration.environment
		} );
		configuration.server = configuration.host;
		var publisher = adapter.publisher( { connection: configuration } );
		metronic.use( publisher );
		metronic.recordUtilization( 1000 );
	}
	return metronic;
}

module.exports = function( services, config ) {
	var configuration = {};
	configuration.environment = services.environment || config.environment;
	var rabbit, metrics;

	if ( services ) {
		configuration.environment = services.environment;
		rabbit = services.rabbit;
		metrics = services.metrics;
	}
	if ( config ) {
		rabbit = config.rabbit;
		metrics = config.metrics;
	}

	metrics = metrics || config;

	if ( rabbit ) {
		configuration.host = rabbit.host;
		configuration.port = rabbit.port;
		configuration.user = rabbit.user;
		configuration.pass = rabbit.pass;
		configuration.timeout = rabbit.timout;
		configuration.vhost = rabbit.vhost;
		configuration.zero = rabbit.zero;
	} else if ( services && _.isArray( services ) ) {
		configuration.host = _.pluck( services, "Address" ).join( "," );
		configuration.port = _.pluck( services, "Port" ).join( "," );
	} else {
		configuration.host = services ? services.Address : "localhost";
		configuration.port = services ? services.Port : 5672;
	}
	_.merge( configuration, metrics );
	return configure( configuration );
};
