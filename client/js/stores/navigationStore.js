import lux from "lux.js";
import window from "window";
import { findIndex } from "lodash";

// We are well aware that there's plenty of work to be done to
// get basePath, urlPrefix, etc. all aligned and to be made
// fully configurable, etc. Right now, the goal is to ship a PoC
var basePath = "/";

function navigateForward( store, path, fromBrowser ) {
	const { history, currentHistory } = store.getState();

	// Has history diverged?
	if ( currentHistory + 1 !== history.length ) {
		history.splice( currentHistory + 1, history.length );
	}

	history.push( {
		path: path,
		id: +( new Date() )
	} );

	store.setState( {
		path: path,
		direction: "forward",
		history: history,
		currentHistory: history.length - 1,
		lastChangeFromBrowser: fromBrowser === true
	} );
}

export default new lux.Store( {
	namespace: "navigation",
	state: {
		path: window.location.pathname.replace( /^\//, "" ),
		direction: "forward",
		history: [ {
			path: window.location.pathname.replace( /^\//, "" ),
			id: 0
		} ],
		currentHistory: 0,
		lastChangeFromBrowser: false
	},
	handlers: {
		browserNavigated: function( event ) {
			const { history, currentHistory } = this.getState();
			const { state: eventState } = event;
			const pastEvent = findIndex( history, { id: eventState ? eventState.id : 0 } );
			if ( pastEvent > -1 ) {
				this.setState( {
					currentHistory: pastEvent,
					path: history[ pastEvent ].path,
					direction: pastEvent < currentHistory ? "backward" : "forward",
					lastChangeFromBrowser: true
				} );
			} else {
				navigateForward( this, eventState.path, true );
			}
		},
		navigateBack: function() {
			let { history, currentHistory } = this.getState();
			currentHistory = currentHistory - 1;
			const newPath = history[ currentHistory ];
			this.setState( {
				path: newPath.path,
				direction: "backward",
				currentHistory,
				lastChangeFromBrowser: false
			} );
		},
		viewHome: function() {
			navigateForward( this, "nonstop/" );
		},
		viewProject: function( { name, owner, branch } ) {
			navigateForward( this, `nonstop/project/${name}/${owner}/${branch}` );
		},
		viewConfigurator: function() {
			navigateForward( this, "nonstop/host/configure" );
		}
	},
	getPath() {
		const { history, currentHistory } = this.getState();
		return history[ currentHistory ].path;
	},
	getFullPath() {
		return this.getHistoryEntry().path;
	},
	getDirection() {
		return this.getState().direction;
	},
	getHistoryEntry() {
		const { history, currentHistory } = this.getState();
		const item = Object.assign( {}, history[ currentHistory ] );
		item.path = `${basePath}${item.path}${window.location.search}`.replace( /\/+/, "/" );
		return item;
	},
	wasLastChangeFromBrowser() {
		return this.getState().lastChangeFromBrowser;
	}
} );
