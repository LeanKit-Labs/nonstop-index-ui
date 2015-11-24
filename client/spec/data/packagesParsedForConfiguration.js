const packages = [
	{
		directory: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
		fullPath: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master/core-blu~BanditSoftware~master~67bd1695~0.1.5~~linux~any~any~x64.tar.gz",
		project: "core-blu",
		owner: "BanditSoftware",
		branch: "master",
		slug: "67bd1695",
		version: "0.1.5",
		build: "",
		platform: "linux",
		osName: "any",
		osVersion: "any",
		architecture: "x64",
		relative: "core-blu-BanditSoftware-master",
		file: "core-blu~BanditSoftware~master~67bd1695~0.1.5~~linux~any~any~x64.tar.gz",
		simpleVersion: "0.1.5",
		released: true
	},
	{
		directory: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
		fullPath: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master/core-blu~BanditSoftware~master~67bd1695~0.1.5~11~linux~any~any~x64.tar.gz",
		project: "core-blu",
		owner: "BanditSoftware",
		branch: "master",
		slug: "67bd1695",
		version: "0.1.5-11",
		build: "11",
		platform: "linux",
		osName: "any",
		osVersion: "any",
		architecture: "x64",
		relative: "core-blu-BanditSoftware-master",
		file: "core-blu~BanditSoftware~master~67bd1695~0.1.5~11~linux~any~any~x64.tar.gz",
		simpleVersion: "0.1.5",
		released: false
	},
	{
		directory: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
		path: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
		fullPath: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master/core-blu~BanditSoftware~master~e367b2e9~0.1.5~10~linux~any~any~x64.tar.gz",
		project: "core-blu",
		owner: "BanditSoftware",
		branch: "master",
		slug: "e367b2e9",
		version: "0.1.5-10",
		build: "10",
		platform: "linux",
		osName: "any",
		osVersion: "any",
		architecture: "x64",
		relative: "core-blu-BanditSoftware-master",
		file: "core-blu~BanditSoftware~master~e367b2e9~0.1.5~10~linux~any~any~x64.tar.gz",
		simpleVersion: "0.1.5",
		released: false
	},
	{
		directory: "/usr/src/app/public/nonstop/package/nonstop-index-ui-LeanKit-Labs-master",
		fullPath: "/usr/src/app/public/nonstop/package/nonstop-index-ui-LeanKit-Labs-master/nonstop-index-ui~LeanKit-Labs~master~da8b6aa4~0.1.0~10~linux~any~any~x64.tar.gz",
		project: "nonstop-index-ui",
		owner: "LeanKit-Labs",
		branch: "master",
		slug: "da8b6aa4",
		version: "0.1.0-10",
		build: "10",
		platform: "linux",
		osName: "any",
		osVersion: "any",
		architecture: "x64",
		relative: "nonstop-index-ui-LeanKit-Labs-master",
		file: "nonstop-index-ui~LeanKit-Labs~master~da8b6aa4~0.1.0~10~linux~any~any~x64.tar.gz",
		simpleVersion: "0.1.0",
		released: false
	}
];

module.exports = {
	tree: {
		"core-blu": {
			BanditSoftware: {
				master: {
					"0.1.5": packages[ 0 ],
					"0.1.5-11": packages[ 1 ],
					"0.1.5-10": packages[ 2 ]
				}
			}
		},
		"nonstop-index-ui": {
			"LeanKit-Labs": {
				master: {
					"0.1.0-10": packages[ 3 ]
				}
			}
		}
	},
	packages,
	selections: {
		project: "core-blu",
		owner: "BanditSoftware",
		branch: "master",
		version: "0.1.5",
		releaseOnly: false,
		host: undefined
	},
	updateInProgress: false
};
