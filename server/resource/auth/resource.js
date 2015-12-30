var fs = require( "fs" );
var path = require( "path" );
var _ = require( "lodash" );

export default function( host ) {
	var loginTemplate = _.template( fs.readFileSync( path.resolve( __dirname, "../../../public/login.html" ), "utf-8" ) );

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
					var message = "";
					if ( env.session.messages && env.session.messages.length ) {
						message = env.session.messages.pop();
					}
					return {
						statusCode: 200,
						headers: {
							"Content-Type": "text/html; charset=utf-8"
						},
						data: loginTemplate( { errorMessage: message } )
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
}
