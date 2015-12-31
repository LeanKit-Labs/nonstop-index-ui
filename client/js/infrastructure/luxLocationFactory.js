import lux from "lux.js";
import win from "window";

export default function( navStore ) {
	// File adapted from react-router/lib/locations/HistoryLocation.js
	if ( !navStore ) {
		throw new Error( "LuxLocation must be supplied a navigation store" );
	}

	let _listeners = [];
	let _isListening = false;

	const LuxLocation = lux.mixin( {
		stores: {
			listenTo: [ "navigation" ],
			onChange() {
				const direction = navStore.getDirection();
				const fromBrowser = navStore.wasLastChangeFromBrowser();
				if ( !fromBrowser ) {
					const entry = navStore.getHistoryEntry();
					if ( direction === "forward" ) {
						win.history.pushState( entry, "", entry.path );
					} else {
						win.history.back();
					}
				}

				notifyChange( direction === "forward" ? "push" : "pop" );
			}
		},

		addChangeListener( listener ) {
			_listeners.push( listener );

			if ( !_isListening ) {
				if ( win.addEventListener ) {
					win.addEventListener( "popstate", onPopState, false );
				} else {
					win.attachEvent( "onpopstate", onPopState );
				}

				_isListening = true;
			}
		},

		removeChangeListener( listener ) {
			_listeners = _listeners.filter( l => l !== listener );

			if ( _listeners.length === 0 ) {
				if ( win.removeEventListener ) {
					win.removeEventListener( "popstate", onPopState, false );
				} else {
					win.removeEvent( "onpopstate", onPopState );
				}

				_isListening = false;
			}
		},

		// Not implemented because we are not navigating
		// the router directly
		push() {},
		replace() {},
		pop() {},

		getCurrentPath() {
			return navStore.getFullPath();
		},

		toString() {
			return "<LuxLocation>";
		}
	}, lux.mixin.store );

	function notifyChange( type ) {
		const change = {
			path: LuxLocation.getCurrentPath(),
			type
		};

		_listeners.forEach( listener => listener.call( LuxLocation, change ) );
	}

	function onPopState( event ) {
		if ( event.state === undefined ) {
			return; // Ignore extraneous popstate events in WebKit.
		}

		lux.publishAction( "browserNavigated", event );
	}

	return LuxLocation;
}
