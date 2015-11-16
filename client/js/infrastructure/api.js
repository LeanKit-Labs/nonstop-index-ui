import lux from "lux.js";
import halon from "halon";
import $ from "jquery";
import window from "window";

var lkAPI = halon( {
	root: `${ window.location.origin }/api/`,
	knownOptions: {},
	adapter: halon.jQueryAdapter( $ ),
	version: 1
} );

function errorHandler( error ) {
	const message = error.toString();
	lux.publishAction( "notifyError", { message } );
	lux.publishAction( "error", error.stack || message );
}

lkAPI.connect().catch( errorHandler );

var uiAPI = halon( {
	root: `${ window.location.origin }/`,
	knownOptions: {
		logging: [ "upload" ],
		metricsCollector: [ "upload" ]
	},
	adapter: halon.jQueryAdapter( $ ),
	version: 1
} );

uiAPI.connect().catch( errorHandler );

export default lux.mixin( {
	getActions: [
		"notifyError",
		"notifySuccess",
		"pageInitialized",
		"loadProjectsSuccess"
	],
	namespace: "api",
	handlers: {
		initializePage() {
			this.loadProjectsSuccess( {
				packages: [
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
						file: "core-blu~BanditSoftware~master~67bd1695~0.1.5~11~linux~any~any~x64.tar.gz"
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
						file: "core-blu~BanditSoftware~master~e367b2e9~0.1.5~10~linux~any~any~x64.tar.gz"
					},
					{
						directory: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
						path: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master",
						fullPath: "/usr/src/app/public/nonstop/package/core-blu-BanditSoftware-master/core-blu~BanditSoftware~master~7116dc04~0.1.5~9~linux~any~any~x64.tar.gz",
						project: "core-blu",
						owner: "BanditSoftware",
						branch: "master",
						slug: "7116dc04",
						version: "0.1.5-9",
						build: "9",
						platform: "linux",
						osName: "any",
						osVersion: "any",
						architecture: "x64",
						relative: "core-blu-BanditSoftware-master",
						file: "core-blu~BanditSoftware~master~7116dc04~0.1.5~9~linux~any~any~x64.tar.gz"
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
						file: "nonstop-index-ui~LeanKit-Labs~master~da8b6aa4~0.1.0~10~linux~any~any~x64.tar.gz"
					}
				]
			} );
		},
		sendLogBatch( data ) {
			/* istanbul ignore next */
			function errorHandler( err ) {
				if ( DEBUG ) {
					console.log( "Unable to reach logging endpoint: ", err );
				}
			}
			uiAPI.logging.upload( data ).catch( errorHandler );
		},
		sendMetricsBatch( data ) {
			/* istanbul ignore next */
			function errorHandler( err ) {
				if ( DEBUG ) {
					console.log( "Unable to reach metrics endpoint: ", err );
				}
			}
			uiAPI.metricsCollector.upload( data ).catch( errorHandler );
		}
	}
}, lux.mixin.actionCreator, lux.mixin.actionListener );
