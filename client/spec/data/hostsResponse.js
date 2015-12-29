module.exports = {
	hosts: [
		{
			serviceHost: {
				port: {
					local: 7003,
					public: 7000
				},
				host: {
					ip: "10.0.0.6",
					name: "littelbrudder.hack.leankitdev.com"
				},
				name: "littlebrudder",
				failures: 1,
				tolerance: 5000
			},
			package: {
				project: "nonstop-index-ui",
				owner: "arobson",
				branch: "master",
				osVersion: "any",
				osName: "any",
				architecture: "x64",
				platform: "linux",
				releaseOnly: true
			},
			index: {
				host: "10.0.0.4",
				port: 4444,
				frequency: 60000,
				token: "4e8d2204-5422-4534-aaa4-4cf297085ef1",
				api: "/api",
				ssl: false
			},
			name: "littlebrudder",
			_links: {
				list: {
					href: "/nonstop/api/host",
					method: "GET",
					parameters: {
						project: {
							choice: [ {
								coreblu: "project"
							}, {
								littlebrudder: "project"
							} ]
						},
						owner: {
							choice: [ {
								BanditSoftware: "owner"
							}, {
								arobson: "owner"
							} ]
						},
						branch: {
							choice: [ {
								master: "branch"
							} ]
						},
						version: {
							choice: []
						},
						build: {
							choice: []
						},
						platform: {
							choice: [ {
								linux: "platform"
							} ]
						},
						architecture: {
							choice: [ {
								x64: "architecture"
							} ]
						}
					}
				},
				register: {
					href: "/nonstop/api/host",
					method: "POST"
				},
				self: {
					href: "/nonstop/api/host/littlebrudder",
					method: "GET"
				},
				update: {
					href: "/nonstop/api/host/littlebrudder",
					method: "PUT"
				},
				notify: {
					href: "/nonstop/api/host/littlebrudder",
					method: "POST"
				}
			},
			_origin: {
				href: "/nonstop/api/host",
				method: "GET",
				parameters: {
					project: {
						choice: [ {
							coreblu: "project"
						}, {
							littlebrudder: "project"
						} ]
					},
					owner: {
						choice: [ {
							BanditSoftware: "owner"
						}, {
							arobson: "owner"
						} ]
					},
					branch: {
						choice: [ {
							master: "branch"
						} ]
					},
					version: {
						choice: []
					},
					build: {
						choice: []
					},
					platform: {
						choice: [ {
							linux: "platform"
						} ]
					},
					architecture: {
						choice: [ {
							x64: "architecture"
						} ]
					}
				}
			}
		},
		{
			serviceHost: {
				port: {
					local: 7000,
					public: 7000
				},
				host: {
					ip: "10.0.0.6",
					name: "lkapp.cloudapp.net"
				},
				name: "core-blu",
				failures: 1,
				tolerance: 5000
			},
			package: {
				project: "nonstop-index-ui",
				owner: "BanditSoftware",
				branch: "master",
				osVersion: "any",
				osName: "any",
				architecture: "x64",
				platform: "linux",
				releaseOnly: false
			},
			index: {
				host: "10.0.0.4",
				port: 4444,
				frequency: 5000,
				token: "4e8d2204-5422-4534-aaa4-4cf297085ef1",
				api: "/api",
				ssl: false
			},
			name: "core-blu",
			_links: {
				list: {
					href: "/nonstop/api/host",
					method: "GET",
					parameters: {
						project: {
							choice: [ {
								coreblu: "project"
							}, {
								littlebrudder: "project"
							} ]
						},
						owner: {
							choice: [ {
								BanditSoftware: "owner"
							}, {
								arobson: "owner"
							} ]
						},
						branch: {
							choice: [ {
								master: "branch"
							} ]
						},
						version: {
							choice: []
						},
						build: {
							choice: []
						},
						platform: {
							choice: [ {
								linux: "platform"
							} ]
						},
						architecture: {
							choice: [ {
								x64: "architecture"
							} ]
						}
					}
				},
				register: {
					href: "/nonstop/api/host",
					method: "POST"
				},
				self: {
					href: "/nonstop/api/host/core-blu",
					method: "GET"
				},
				update: {
					href: "/nonstop/api/host/core-blu",
					method: "PUT"
				},
				notify: {
					href: "/nonstop/api/host/core-blu",
					method: "POST"
				}
			},
			_origin: {
				href: "/nonstop/api/host",
				method: "GET",
				parameters: {
					project: {
						choice: [ {
							coreblu: "project"
						}, {
							littlebrudder: "project"
						} ]
					},
					owner: {
						choice: [ {
							BanditSoftware: "owner"
						}, {
							arobson: "owner"
						} ]
					},
					branch: {
						choice: [ {
							master: "branch"
						} ]
					},
					version: {
						choice: []
					},
					build: {
						choice: []
					},
					platform: {
						choice: [ {
							linux: "platform"
						} ]
					},
					architecture: {
						choice: [ {
							x64: "architecture"
						} ]
					}
				}
			},
			_resource: "host",
			_action: "list"
		}
	]
};
