const navigationStoreFactory = require( "inject!stores/navigationStore" );

describe( "navigation store", () => {
	let navigationStore, locationStub;

	function setup( options = {} ) {
		locationStub = {
			pathname: options.pathname || "",
			search: options.search || ""
		};
		navigationStore = navigationStoreFactory( {
			window: {
				location: locationStub
			}
		} );
	}

	afterEach( () => {
		if ( navigationStore ) {
			navigationStore.dispose();
			navigationStore = null;
		}
	} );

	describe( "handlers", () => {
		beforeEach( () => {
			setup();
		} );

		describe( "when handling viewHome", () => {
			let state;

			beforeEach( () => {
				lux.publishAction( "viewHome" );
				state = navigationStore.getState();
			} );
			it( "should set the path and direction", () => {
				state.path.should.equal( "" );
				state.direction.should.equal( "forward" );
			} );
			it( "should update history", () => {
				state.history.should.have.lengthOf( 2 );
				state.history[ 1 ].should.contain( { path: "" } );
			} );
			it( "should update the current history", () => {
				state.currentHistory.should.equal( 1 );
			} );
			it( "should mark the request as not from the browser", () => {
				state.lastChangeFromBrowser.should.be.false;
			} );
		} );

		describe( "when handling viewHome when not at the most recent history", () => {
			let state;

			beforeEach( () => {
				state = navigationStore.getState();
				state.currentHistory = 0;
				state.history.push( {
					path: "/another",
					id: 234
				} );
				state.lastChangeFromBrowser = true;
				lux.publishAction( "viewHome" );
			} );
			it( "should set the path and direction", () => {
				state.path.should.equal( "" );
				state.direction.should.equal( "forward" );
			} );
			it( "should update history", () => {
				state.history.should.have.lengthOf( 2 );
				state.history[ 1 ].should.contain( { path: "" } );
			} );
			it( "should update the current history", () => {
				state.currentHistory.should.equal( 1 );
			} );
			it( "should mark the request as not from the browser", () => {
				state.lastChangeFromBrowser.should.be.false;
			} );
		} );

		describe( "when handling viewProject", () => {
			let state;

			beforeEach( () => {
				state = navigationStore.getState();
				state.lastChangeFromBrowser = true;
				lux.publishAction( "viewProject", {
					name: "nonstop-index-ui",
					owner: "LeanKit-Labs",
					branch: "master"
				} );
			} );
			it( "should set the path and direction", () => {
				state.path.should.equal( "project/nonstop-index-ui/LeanKit-Labs/master" );
				state.direction.should.equal( "forward" );
			} );
			it( "should update history", () => {
				state.history.should.have.lengthOf( 2 );
				state.history[ 1 ].should.contain( { path: "project/nonstop-index-ui/LeanKit-Labs/master" } );
			} );
			it( "should update the current history", () => {
				state.currentHistory.should.equal( 1 );
			} );
			it( "should mark the request as not from the browser", () => {
				state.lastChangeFromBrowser.should.be.false;
			} );
		} );

		describe( "when handling navigateBack", () => {
			let state;
			beforeEach( () => {
				state = navigationStore.getState();
				state.currentHistory = 1;
				state.direction = "forwards";
				state.history.push( {
					path: "/another",
					id: 234
				} );
				state.lastChangeFromBrowser = true;
				lux.publishAction( "navigateBack" );
			} );

			it( "should set the current path to now current history path", () => {
				state.path.should.equal( "" );
			} );
			it( "should update the direction to backwards", () => {
				state.direction.should.equal( "backward" );
			} );
			it( "should reduce the currentHistory number by 1", () => {
				state.currentHistory.should.equal( 0 );
			} );
			it( "should mark the request as not from the browser", () => {
				state.lastChangeFromBrowser.should.be.false;
			} );
		} );

		describe( "when handling browserNavigated", () => {
			let state;
			beforeEach( () => {
				state = navigationStore.getState();
				state.currentHistory = 1;
				state.direction = "forwards";
				state.history.push( {
					path: "/another",
					id: 234
				} );
				state.lastChangeFromBrowser = false;
			} );

			describe( "and event state is not provided", () => {
				beforeEach( () => {
					lux.publishAction( "browserNavigated", {} );
				} );

				it( "should navigate to the first item in history", () => {
					state.path.should.equal( "" );
				} );
				it( "should update the direction to backward", () => {
					state.direction.should.equal( "backward" );
				} );
				it( "should set the currentHistory correctly", () => {
					state.currentHistory.should.equal( 0 );
				} );
				it( "should mark the request as from the browser", () => {
					state.lastChangeFromBrowser.should.be.true;
				} );
			} );
			describe( "and event state matches cached history (going backwards)", () => {
				beforeEach( () => {
					lux.publishAction( "browserNavigated", { state: { id: 0 } } );
				} );
				it( "should set the current path to now current history path", () => {
					state.path.should.equal( "" );
				} );
				it( "should update the direction to backward", () => {
					state.direction.should.equal( "backward" );
				} );
				it( "should set the currentHistory correctly", () => {
					state.currentHistory.should.equal( 0 );
				} );
				it( "should mark the request as from the browser", () => {
					state.lastChangeFromBrowser.should.be.true;
				} );
			} );
			describe( "and event state matches cached history (going forwards)", () => {
				beforeEach( () => {
					state.currentHistory = 0;
					lux.publishAction( "browserNavigated", { state: { id: 234 } } );
				} );
				it( "should set the current path to now current history path", () => {
					state.path.should.equal( "/another" );
				} );
				it( "should update the direction to backward", () => {
					state.direction.should.equal( "forward" );
				} );
				it( "should set the currentHistory correctly", () => {
					state.currentHistory.should.equal( 1 );
				} );
				it( "should mark the request as from the browser", () => {
					state.lastChangeFromBrowser.should.be.true;
				} );
			} );
			describe( "and event state is not in cached history", () => {
				beforeEach( () => {
					lux.publishAction( "browserNavigated", {
						state: {
							id: 12312312,
							path: "project/nonstop-index-ui"
						}
					} );
				} );
				it( "should set the path and direction", () => {
					state.path.should.equal( "project/nonstop-index-ui" );
					state.direction.should.equal( "forward" );
				} );
				it( "should update history", () => {
					state.history.should.have.lengthOf( 3 );
					state.history[ 2 ].should.contain( { path: "project/nonstop-index-ui" } );
				} );
				it( "should update the current history", () => {
					state.currentHistory.should.equal( 2 );
				} );
				it( "should mark the request as from the browser", () => {
					state.lastChangeFromBrowser.should.be.true;
				} );
			} );
		} );
	} );

	describe( "helpers", () => {
		it( "should add a getPath method", () => {
			setup();
			Object.assign( navigationStore.getState(), {
				currentHistory: 0,
				history: [ { path: "sample", id: 123 } ]
			} );
			navigationStore.getPath().should.equal( "sample" );
		} );
		it( "should add a getFullPath method", () => {
			setup();
			Object.assign( navigationStore.getState(), {
				currentHistory: 0,
				history: [ { path: "sample", id: 123 } ]
			} );
			navigationStore.getFullPath().should.equal( "/sample" );
		} );
		it( "should add a getHistoryEntry method", () => {
			setup();
			Object.assign( navigationStore.getState(), {
				currentHistory: 0,
				history: [ { path: "/sample", id: 123 }, { path: "other", id: 234 } ]
			} );
			navigationStore.getHistoryEntry().should.eql( {
				path: "/sample",
				id: 123
			} );
		} );
		it( "should include the query params", () => {
			setup( { pathname: "/", search: "?projectId=123" } );
			navigationStore.getFullPath().should.equal( "/?projectId=123" );
		} );
		it( "should add a getDirection method", () => {
			setup();
			navigationStore.getDirection().should.equal( "forward" );
		} );
		it( "should add a wasLastChangeFromBrowser method", () => {
			setup();
			navigationStore.wasLastChangeFromBrowser().should.be.false;
		} );
	} );
} );
