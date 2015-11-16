define( [
	"lux.js"
], function( lux ) {
	return function( navStore ) {
		// File adapted from react-router/lib/locations/HistoryLocation.js
		if ( !navStore ) {
			throw new Error( "LuxLocation must be supplied a navigation store" );
		}

		var _listeners = [];

		function notifyChange( type ) {
			var change = {
				path: LuxLocation.getCurrentPath(),
				type: type
			};

			_listeners.forEach( function( listener ) {
				listener.call( LuxLocation, change );
			} );
		}

		var LuxLocation = lux.mixin( {
			stores: {
				listenTo: [ "navigation" ],
				onChange: function() {
					var direction = navStore.getDirection();
					notifyChange( direction === "forward" ? "push" : "pop" );
				}
			},

			addChangeListener: function( listener ) {
				_listeners.push( listener );
			},

			removeChangeListener: function( listener ) {
				_listeners = _listeners.filter( function( l ) {
					return l !== listener;
				} );
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
} );

