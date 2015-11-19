import lux from "lux.js";

export default new lux.Store( {
	namespace: "user",
	state: {
		_json: {}
	},
	handlers: {
		loadUserSuccess( data ) {
			this.setState( data );
		},
		loadUserFailure: function() {}
	},
	getUser() {
		const { displayName, username, profileUrl, _json: details } = this.getState();
		return {
			displayName,
			username,
			profileUrl,
			company: details.company
		};
	}
} );
