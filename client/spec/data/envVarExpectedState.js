module.exports = {
	defaultState: {
		host: null,
		environmentVariables: [],
		status: null
	},
	loadingState: {
		host: "HostWithTheMost",
		status: "loading",
		environmentVariables: []
	},
	loadedState: {
		host: "HostWithTheMost",
		status: "loaded",
		environmentVariables: [
			{ key: "thangy", val: "thang" },
			{ key: "thingy", val: "thing" },
			{ key: "thungy", val: "thung" }
		]
	},
	errorState: {
		host: "HostWithTheMost",
		status: "error",
		environmentVariables: []
	},
	emptyState: {
		host: "HostWithTheMost",
		status: "loaded",
		environmentVariables: []
	}
};
