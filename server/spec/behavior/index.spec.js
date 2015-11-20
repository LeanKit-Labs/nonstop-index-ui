require( "../setup" );
var fount = require( "fount" );

describe( "Server Index", function() {
	var registerSpy;
	before( function() {
		registerSpy = sinon.spy( fount, "register" );
		return require( "../../index" );
	} );
	after( function() {
		registerSpy.restore();
	} );
	it( "should register metrics", function() {
		registerSpy.should.be.calledWith( "metrics" );
	} );
	it( "should register redis", function() {
		registerSpy.should.be.calledWith( "redis" );
	} );
	it( "should register postal", function() {
		registerSpy.should.be.calledWith( "postal" );
	} );
	it( "should register loggingCollectorConfig", function() {
		registerSpy.should.be.calledWith( "loggingCollectorConfig" );
	} );
	it( "should register ahpubsub", function() {
		registerSpy.should.be.calledWith( "ahpubsub" );
	} );
} );
