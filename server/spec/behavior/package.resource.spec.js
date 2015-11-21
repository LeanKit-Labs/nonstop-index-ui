require( "babel/register" );
var resourceFactory = require( "../../resource/package/resource" );

describe( "Package Resource", function() {
	describe( "when invoking download resource handler", function() {
		var resource, cfg, env;
		before( function() {
			cfg = {
				indexUrl: "all/the/paintings/on/the/tombs/",
				client: {
					headers: {
						They: "do the sand dance don't you know"
					}
				}
			};
			env = {
				data: {
					0: "If/they/move/too/quick/(oh-whey-oh)"
				}
			};
			resource = resourceFactory( {}, cfg );
		} );
		it( "should return expected value", function() {
			resource.actions.download.handle( env ).should.eql( {
				status: 200,
				forward: {
					url: "all/the/paintings/on/the/tombs/nonstop/package/If/they/move/too/quick/(oh-whey-oh)",
					method: "GET",
					headers: {
						They: "do the sand dance don't you know"
					},
					rejectUnauthorized: false,
					requestCert: true
				}
			} );
		} );
	} );
} );
