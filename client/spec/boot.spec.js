import bootFactory from "inject!boot";

describe( "boot", () => {
	let locationStub;

	function testInit() {
		bootFactory( {
			"babel/polyfill": {},
			modernizr: {},
			"./clientConfig": {},
			"lux.js": {},
			window: {
				location: locationStub
			},
			"./app": {},
			postal: {}
		} );
	}

	beforeEach( () => {
		locationStub = {
			protocol: "http:",
			host: "nonstop-index-ui.com",
			pathname: "/projects/core-blu"
		};
	} );

	describe( "when adding polyfill for window.location.origin", () => {
		it( "should add origin prop when on default port", () => {
			testInit();
			locationStub.origin.should.equal( "http://nonstop-index-ui.com" );
		} );
		it( "should add origin prop when port is specified", () => {
			locationStub.host += ":4444";
			testInit();
			locationStub.origin.should.equal( "http://nonstop-index-ui.com:4444" );
		} );
		it( "should not polyfill if origin.location already exists", () => {
			locationStub.origin = "Something Witty";
			testInit();
			locationStub.origin.should.equal( "Something Witty" );
		} );
	} );
} );
