var autohost = require( "autohost" );
var GitHubAuth = require( "autohost-github-auth" );
var when = require( "when" );
var _ = require( "lodash" );
var sessionFactory = require( "./session" );
var middlewareHeaderFactory = require( "./middleware/header" );
var middlewareCacheHeaderFactory = require( "./middleware/cache-header" );

module.exports = function( options ) {
	var fount = options.fount;
	var pkg = options.pkg;
	var hyped = options.hyped;
	var log = options.log;
	var metrics = options.metrics;
	var config = options.config;
	var configApp = options.configApp || _.noop;

	log( config.logging );

	function setupAutohost() {
		var hostConfig = config.host;
		hostConfig.fount = fount;
		hostConfig.metrics = metrics;

		if ( config.auth.enabled ) {
			hostConfig.authProvider = new GitHubAuth( config );
		}

		var sessionStore = sessionFactory( autohost.sessionLib, config.session );
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

		result.host.http.middleware( "/", middlewareHeaderFactory( pkg ) );
		result.host.http.middleware( "/", middlewareCacheHeaderFactory() );
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
