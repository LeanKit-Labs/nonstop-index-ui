require( "../setup" );
var path = require( "path" );
var autohost = function( config ) {
	return {
		start: sinon.spy(),
		http: {
			middleware: sinon.spy( function( path, handler ) {
				path.should.be.a( "string" );
				path[ 0 ].should.equal( "/" );
				handler.should.be.a( "function" );
			} )
		},
		config: config
	};
};
var _ = require( "lodash" );

describe( "Init", function() {
	var initFactory, dependencies, options, authCfg, app;
	beforeEach( function() {
		authCfg = {
			enabled: true,
			sessionMessages: true,
			loginEndpoint: "/nonstop/auth/login",
			authEndpoint: "/nonstop/auth/github",
			github: {
				organization: "YOUR_GITHUB_ORG",
				clientId: "YOUR_CLIENT_ID_HERE",
				clientSecret: "YOUR_CLIENT_SECRET_HERE",
				callbackUrl: "http://localhost:8048/nonstop/auth/github/callback"
			}
		};
		options = {
			config: {
				host: {},
				auth: authCfg
			},
			log: sinon.stub()
		};
		dependencies = {
			autohost: autohost,
			"autohost-github-auth": sinon.stub()
		};
		initFactory = proxyquire( path.resolve( "./server/init/index" ), dependencies );
	} );
	describe( "with auth enabled", function() {
		beforeEach( function() {
			return initFactory( options ).then( function( a ) {
				app = a;
				return app;
			} );
		} );
		it( "should stand up a new GitHubAuth instance", function() {
			dependencies[ "autohost-github-auth" ].should.be.calledWithMatch( {
				host: sinon.match.object,
				auth: authCfg
			} );
		} );
		it( "should register expected middleware", function() {
			app.host.http.middleware.should.be.calledTwice;
		} );
	} );
	describe( "with anonymous routes", function() {
		beforeEach( function() {
			var opt = _.clone( options );
			opt.config.host.anonymous = [ "/route/one", "/route/two" ];
			return initFactory( opt ).then( function( a ) {
				app = a;
				return app;
			} );
		} );
		it( "should register expected middleware", function() {
			app.host.http.middleware.callCount.should.equal( 4 );
		} );
	} );
} );
