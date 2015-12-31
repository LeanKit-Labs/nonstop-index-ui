var fs = require( "fs" );
var path = require( "path" );

export default function( host ) {
	return {
		name: "project",
		actions: {
			list: {
				url: "/project/",
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
			},
			self: {
				url: "/project/*",
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
}
