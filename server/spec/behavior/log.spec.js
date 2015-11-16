require( "../setup" );

describe( "Logging", function() {
	describe( "before initialization", function() {
		var log;
		before( function() {
			log = setupLog( "test" );
		} );

		it( "should not throw exceptions", function() {
			should.not.throw( function() {
				log.debug( "one" );
			} );
			should.not.throw( function() {
				log.info( "two" );
			} );
			should.not.throw( function() {
				log.warn( "three" );
			} );
			should.not.throw( function() {
				log.error( "four" );
			} );
		} );

		after( function() {
			logAdapter.reset( "test" );
		} );
	} );

	describe( "with debug env set", function() {
		var original = process.env.DEBUG;
		var log;
		before( function() {
			process.env.DEBUG = "test";
			log = setupLog( "test" );
			log.debug( "hello" );
			log.info( "info" );
			log.warn( "warn" );
			log.error( "error" );
		} );

		it( "should not send log entries to other adapters", function() {
			logAdapter.namespaces.test.should.partiallyEql( {
				debug: [],
				error: [],
				info: [],
				warn: []
			} );
		} );

		after( function() {
			process.env.DEBUG = original;
			logAdapter.reset( "test" );
		} );
	} );

	describe( "without debug", function() {
		var original = process.env.DEBUG;
		var log;
		before( function() {
			delete process.env.DEBUG;
			log = setupLog( "test", 2 );
			log.debug( "debug" );
			log.info( "info" );
			log.warn( "warn" );
			log.error( "error" );
		} );

		it( "should log entries to adapter", function() {
			logAdapter.namespaces.test.should.eql( {
				debug: [],
				error: [ "error" ],
				info: [],
				warn: [ "warn" ]
			} );
		} );

		after( function() {
			process.env.DEBUG = original;
			logAdapter.reset( "test" );
		} );
	} );
} );
