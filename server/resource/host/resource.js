var fs = require( "fs" );
var path = require( "path" );

export default function( host ) {
	return {
		name: "host",
		actions: {
			list: {
				url: "/host/",
				hidden: true,
				method: "GET",
				handle: ( env ) => {
					return {
						statusCode: 200,
						headers: {
							"Content-Type": "text/html; charset=utf-8"
						},
						data: fs.readFileSync( path.resolve( __dirname, "../../../public/index.html" ) )
					};
				}
			}
		}
	};
};
