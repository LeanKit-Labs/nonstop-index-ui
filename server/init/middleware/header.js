module.exports = function( pkg ) {
	return function customHeaderMiddleware( req, res, next ) {
		res.set( {
			"X-NS-App-Version": pkg.version,
			"X-NS-App-Description": pkg.description,
			"X-NS-App-Name": pkg.name
		} );
		next();
	};
};
