import lux from "lux.js";
import win from "window";

export default function( navStore ) {
	// File adapted from react-router/lib/locations/HistoryLocation.js
	if ( !navStore ) {
		throw new Error( "LuxLocation must be supplied a navigation store" );
	}

	var _listeners = [];
	var _isListening = false;

	function notifyChange( type ) {
		var change = {
			path: LuxLocation.getCurrentPath(),
			type: type
		};

		_listeners.forEach( function( listener ) {
			listener.call( LuxLocation, change );
		} );
	}

	function onPopState( event ) {
		if ( event.state === undefined ) {
			return; // Ignore extraneous popstate events in WebKit.
		}

		lux.publishAction( "browserNavigated", event );
	}

	var LuxLocation = lux.mixin( {
		stores: {
			listenTo: [ "navigation" ],
			onChange: function() {
				var direction = navStore.getDirection();
				var fromBrowser = navStore.wasLastChangeFromBrowser();
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

		addChangeListener: function( listener ) {
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

		removeChangeListener: function( listener ) {
			_listeners = _listeners.filter( function( l ) {
				return l !== listener;
			} );

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
		push: function() {},
		replace: function() {},
		pop: function() {},

		getCurrentPath: function() {
			return navStore.getFullPath();
		},

		toString: function() {
			return "<LuxLocation>";
		}

	}, lux.mixin.store );

	return LuxLocation;
};
