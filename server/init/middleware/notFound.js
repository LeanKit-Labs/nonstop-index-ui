module.exports = function( config ) {
	return function notFoundMiddleware( req, res, next ) {
		res.format( {
			"text/html": function() {
				res.status( 404 ).send( { message: "Not found" } );
			},

			"application/json": function() {
				res.status( 404 ).send( { message: "Not found" } );
			},

			"application/hal+json": function() {
				res.status( 404 ).send( { message: "Not found" } );
			},

			default: function() {
				// log the request and respond with 406
				res.status( 406 ).send( "Not Acceptable" );
			}
		} );
	};
};
