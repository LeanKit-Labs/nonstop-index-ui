import lux from "lux.js";

export default new lux.Store( {
	namespace: "layout",
	state: {},
	handlers: {
		noop() {}
	},
	getExample() {
		const state = this.getState();
		return state;
	}
} );
