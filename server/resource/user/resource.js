export default function( host ) {
	return {
		name: "user",
		actions: {
			me: {
				url: "/user/me",
				hidden: true,
				method: "GET",
				handle: ( env ) => {
					return {
						statusCode: 200,
						headers: {
							"Content-Type": "application/json; charset=utf-8"
						},
						data: env.user
					};
				}
			}
		}
	};
};
