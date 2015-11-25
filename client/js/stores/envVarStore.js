import lux from "lux.js";
import { map, sortBy, pick } from "lodash";

function removeHalArtifacts( resp ) {
	return pick( resp, ( val, key ) => {
		return key[ 0 ] !== "_";
	} );
}

export default new lux.Store( {
	namespace: "environment",
	state: {
		host: null,
		environmentVariables: [],
		status: null
	},
	handlers: {
		loadEnvironmentForHost( { name } ) {
			this.setState( { host: name, status: "loading" } );
		},
		loadEnvironmentForHostSuccess( data ) {
			const sorted = sortBy( map( removeHalArtifacts( data ), ( val, key ) => {
				return { key, val };
			} ), "key" );
			this.setState( { environmentVariables: sorted, status: "loaded" } );
		},
		loadEnvironmentForHostError( data ) {
			this.setState( { status: "error" } );
		},
		clearEnvVarChoice( data ) {
			this.setState( {
				host: null,
				environmentVariables: [],
				status: null
			} );
		}
	},
	getEnvironmentInfo() {
		return this.getState();
	}
} );
