module.exports = {
	"core-blu": {
		owners: {
			BanditSoftware: {
				branches: {
					master: [
						"core-blu~BanditSoftware~master~67bd1695~0.1.5~11~linux~any~any~x64.tar.gz",
						"core-blu~BanditSoftware~master~e367b2e9~0.1.5~10~linux~any~any~x64.tar.gz"
					]
				}
			}
		}
	},
	"nonstop-index-ui": {
		hosts: [
			{
				branch: "master",
				hostName: "lkapp.cloudapp.net",
				ip: "10.0.0.6",
				name: "core-blu",
				owner: "BanditSoftware",
				project: "nonstop-index-ui"
			},
			{
				branch: "master",
				hostName: "littelbrudder.hack.leankitdev.com",
				ip: "10.0.0.6",
				name: "littlebrudder",
				owner: "arobson",
				project: "nonstop-index-ui"
			}
		],
		owners: {
			"LeanKit-Labs": {
				branches: {
					master: [
						"nonstop-index-ui~LeanKit-Labs~master~da8b6aa4~0.1.0~10~linux~any~any~x64.tar.gz"
					]
				}
			}
		}
	}
};
