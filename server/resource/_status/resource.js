export default function( host ) {
	return {
		name: "_status",
		actions: {
			self: {
				url: "/_status",
				method: "GET",
				handle: ( env ) => {
					env.reply( { statusCode: 200, data: "OK" } );
				}
			}
		}
	};
};
