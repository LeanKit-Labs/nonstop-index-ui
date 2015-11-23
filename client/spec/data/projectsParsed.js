const packagesResponse = require( "./packagesResponse" );
module.exports = {
	deployChoice: null,
	releaseChoice: null,
	hosts: [],
	hostByProject: {},
	projects: {
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
	},
	packages: {
		"core-blu~BanditSoftware~master~67bd1695~0.1.5~11~linux~any~any~x64.tar.gz": Object.assign( {}, packagesResponse.packages[ 1 ], { released: true, releasable: false } ),
		"core-blu~BanditSoftware~master~e367b2e9~0.1.5~10~linux~any~any~x64.tar.gz": Object.assign( {}, packagesResponse.packages[ 2 ], { released: false, releasable: false } ),
		"nonstop-index-ui~LeanKit-Labs~master~da8b6aa4~0.1.0~10~linux~any~any~x64.tar.gz": Object.assign( {}, packagesResponse.packages[ 3 ], { released: false, releasable: true, simpleVersion: packagesResponse.packages[ 3 ].version.split( "-" )[ 0 ] } )
	}
};
