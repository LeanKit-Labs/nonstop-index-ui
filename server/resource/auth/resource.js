var fs = require( "fs" );
var path = require( "path" );

export default function( host ) {
	return {
		name: "auth",
		actions: {
			github: {
				url: "/auth/github",
				hidden: true,
				method: "GET",
				handle: ( env ) => {}
			},
			githubCallback: {
				url: "/auth/github/callback",
				hidden: true,
				method: "GET",
				handle: ( env ) => {
					return {
						redirect: {
							status: 302,
							url: "/nonstop"
						}
					};
				}
			},
			login: {
				url: "/auth/login",
				hidden: true,
				method: "GET",
				handle: ( env ) => {
					return {
						statusCode: 200,
						headers: {
							"Content-Type": "text/html; charset=utf-8"
						},
						data: fs.readFileSync( path.resolve( __dirname, "../../../public/login.html" ) )
					};
				}
			},
			logout: {
				url: "/auth/logout",
				hidden: true,
				method: "GET",
				handle: ( env ) => {
					env._original.req.logout();
					return {
						redirect: {
							status: 302,
							url: "/nonstop/auth/login"
						}
					};
				}
			}
		}
	};
};
