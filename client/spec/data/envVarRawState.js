module.exports = {
	envResponseBody: {
		thingy: "thing",
		thungy: "thung",
		thangy: "thang",
		_links: {
			environment: {
				href: "/api/status/environment",
				method: "GET"
			},
			self: {
				href: "/api/status/",
				method: "GET"
			},
			settings: {
				href: "/api/status/settings",
				method: "GET"
			}
		},
		_origin: {
			href: "/api/status/environment",
			method: "GET"
		},
		_resource: "status",
		_action: "environment"
	},
	loadEnvironmentForHostActionState: { name: "HostWithTheMost" }
};
