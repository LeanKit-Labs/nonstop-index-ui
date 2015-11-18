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
						status: 200,
						data: "<!doctype html><a href='/nonstop/auth/github'>Login with GitHub</a>"
					};
				}
			}
		}
	};
};
