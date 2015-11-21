export default function( host, config ) {
	return {
		name: "package",
		actions: {
			download: {
				url: "/*",
				method: "GET",
				handle: ( env ) => {
					return {
						status: 200,
						forward: {
							url: config.indexUrl + "nonstop/package/" + env.data[ "0" ],
							method: "GET",
							headers: config.client.headers, // TODO: consider moving to common location for client & server?
							rejectUnauthorized: false,
							requestCert: true
						}
					};
				}
			}
		}
	};
};
