var autohost = require( "autohost" );
var GitHubAuth = require( "autohost-github-auth" );
var when = require( "when" );
var _ = require( "lodash" );

module.exports = function( options ) {
	var fount = options.fount;
	var pkg = options.pkg;
	var hyped = options.hyped;
	var log = options.log;
	var metrics = options.metrics;
	var config = options.config;
	var configApp = options.configApp || _.noop;
	var authProvider = new GitHubAuth( config );

	log( config.logging );

	function setupAutohost() {
		var hostConfig = config.host;
		hostConfig.fount = fount;
		hostConfig.metrics = metrics;
		hostConfig.authProvider = authProvider;

		var sessionStore = require( "./session" )( autohost.sessionLib, config.session );
		if ( sessionStore ) {
			hostConfig.session = _.extend( {}, config.session.config, { store: sessionStore } );
		}

		return when.promise( function( resolve ) {
			var host;
			if ( hyped ) {
				host = hyped.createHost( autohost, hostConfig, function() {
					resolve( {
						host: host
					} );
				} );
			} else {
				host = autohost( hostConfig );
				resolve( {
					host: host
				} );
			}
		} );
	}

	function startWithMiddleware( result ) {
		// This allows us to skip routes matching what is defined as anonymous
		( config.host.anonymous || [] ).forEach( function( path ) {
			result.host.http.middleware( path, function customSkipAuthMiddleware( req, res, next ) {
				req.skipAuth = true;
				next();
			} );
		} );

		result.host.http.middleware( "/", require( "./middleware/header" )( pkg ) );
		result.host.http.middleware( "/", require( "./middleware/cache-header" )() );
		result.host.start();
		return result;
	}

	return setupAutohost()
		.then( function( app ) {
			return when( configApp( app ) )
				.then( function() {
					return app;
				} );
		} )
		.then( startWithMiddleware );
};
