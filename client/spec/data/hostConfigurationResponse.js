module.exports = {
	index: {
		packages: "/index/nonstop/package",
		api: "/index/api",
		host: "10.0.0.4",
		port: 4444,
		frequency: 60000,
		token: "4e8d2204-5422-4534-aaa4-4cf297085ef1",
		ssl: false
	},
	"package": {
		project: "littlebrudder",
		owner: "arobson",
		branch: "master",
		build: "2",
		version: "0.1.0",
		osVersion: "any",
		osName: "any",
		architecture: "x64",
		platform: "linux"
	},
	_links: {
		configure: {
			href: "/api/control/",
			method: "PATCH"
		},
		command: {
			href: "/api/control/",
			method: "PUT"
		}
	},
	_origin: {
		href: "/api/control",
		method: "PATCH"
	},
	_resource: "control",
	_action: "configure"
};
