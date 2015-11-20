require( "../setup" );
var fount = require( "fount" );
var path = require( "path" );

describe( "Server Index", function() {
	var registerSpy, dependecies;
	before( function() {
		dependecies = {
			"./init": sinon.stub(),
			"babel/register": {}
		};
		registerSpy = sinon.spy( fount, "register" );
		return proxyquire( path.resolve( __dirname, "../../index" ), dependecies );
	} );
	after( function() {
		registerSpy.restore();
	} );
	it( "should invoke the init factory", function() {
		dependecies[ "./init" ].should.be.calledOnce;
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
