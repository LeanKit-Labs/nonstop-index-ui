module.exports = function() {
	return function cacheHeaderMiddleware( req, res, next ) {
		if ( req.xhr ) {
			// IE caches XHR overly aggressively. This will effectively prevent IE from caching XHR
			// responses while allowing other browsers to still receive 304s based on eTags.
			res.set( "Expires", -1 );
		}

		next();
	};
};
