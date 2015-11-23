import lux from "lux.js";

export default new lux.Store( {
	namespace: "layout",
	state: {
		type: "success",
		message: ""
	},
	handlers: {
		applySettingsSuccess() {
			this.setState( {
				type: "success",
				message: "Successfully updated host"
			} );
		},
		releasePackageSuccess() {
			this.setState( {
				type: "success",
				message: "Package release successful."
			} );
		},
		releasePackageError( data ) {
			this.setState( {
				type: "danger",
				message: `Release was unsuccessful. Reason: ${data.message}`
			} );
		},
		handleAlertClose() {
			this.setState( {
				message: ""
			} );
		}
	},
	getAlert() {
		const state = this.getState();
		return state.message ? state : null;
	}
} );
