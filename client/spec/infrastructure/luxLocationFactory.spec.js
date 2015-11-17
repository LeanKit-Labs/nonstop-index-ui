var luxLocationFactoryInject = require( "inject!infrastructure/luxLocationFactory" );

describe( "LuxLocation factory", function() {
	var LuxLocation, luxLocationFactory, navStoreStub, windowStub, actions;

	beforeEach( function() {
		actions = {
			browserNavigated: sinon.stub()
		};

		lux.customActionCreator( actions );

		windowStub = {
			addEventListener: sinon.stub(),
			removeEventListener: sinon.stub(),
			history: {
				back: sinon.stub(),
				pushState: sinon.stub()
			}
		};
		navStoreStub = {
			getDirection: sinon.stub(),
			getFullPath: sinon.stub(),
			getHistoryEntry: sinon.stub(),
			wasLastChangeFromBrowser: sinon.stub().returns( false )
		};
		luxLocationFactory = luxLocationFactoryInject( {
			window: windowStub
		} );
		LuxLocation = luxLocationFactory( navStoreStub );
	} );

	afterEach( function() {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );
	} );

	describe( "when not passing a navigation store", function() {
		it( "should throw an error", function() {
			luxLocationFactory.should.throw( "LuxLocation must be supplied a navigation store" );
		} );
	} );

	describe( "when omitting functionality", function() {
		it( "should not throw when calling push", function() {
			( function() {
				LuxLocation.push( "url" );
			} ).should.not.throw( Error );
		} );
		it( "should not throw when calling pop", function() {
			( function() {
				LuxLocation.pop();
			} ).should.not.throw( Error );
		} );
		it( "should not throw when calling replace", function() {
			( function() {
				LuxLocation.replace( "new/url" );
			} ).should.not.throw( Error );
		} );
	} );

	describe( "helper methods", function() {
		it( "should support getCurrentPath", function() {
			navStoreStub.getFullPath.returns( "/path/123" );
			LuxLocation.getCurrentPath().should.equal( "/path/123" );
		} );

		it( "should support toString", function() {
			LuxLocation.toString().should.equal( "<LuxLocation>" );
		} );
	} );

	describe( "listeners", function() {
		describe( "when subscribing multiple listeners", () => {
			let listener1, listener2;
			beforeEach( () => {
				listener1 = sinon.stub();
				listener2 = sinon.stub();
			} );

			it( "should only add one popState listener", () => {
				LuxLocation.addChangeListener( listener1 );
				LuxLocation.addChangeListener( listener2 );
				windowStub.addEventListener.should.be.calledOnce;
			} );

			it( "should only add one popState listener in IE", () => {
				windowStub.addEventListener = null;
				windowStub.attachEvent = sinon.stub();
				LuxLocation.addChangeListener( listener1 );
				LuxLocation.addChangeListener( listener2 );
				windowStub.attachEvent.should.be.calledOnce;
			} );

			afterEach( () => {
				LuxLocation.removeChangeListener( listener1 );
				LuxLocation.removeChangeListener( listener2 );
			} );
		} );

		describe( "when unsubscribing multiple listeners", () => {
			let listener1, listener2;
			beforeEach( () => {
				listener1 = sinon.stub();
				listener2 = sinon.stub();
				LuxLocation.addChangeListener( listener1 );
				LuxLocation.addChangeListener( listener2 );
			} );

			it( "should remove the popState listener when the last listener is removed", () => {
				LuxLocation.removeChangeListener( listener1 );
				LuxLocation.removeChangeListener( listener2 );
				windowStub.removeEventListener.should.be.calledOnce;
			} );

			it( "should remove the popState listener in IE when the last listener is removed", () => {
				windowStub.removeEventListener = null;
				windowStub.removeEvent = sinon.stub();
				LuxLocation.removeChangeListener( listener1 );
				LuxLocation.removeChangeListener( listener2 );
				windowStub.removeEvent.should.be.calledOnce;
			} );
		} );

		it( "should remove the popState listener when the last listener is removed", () => {
			let listener2 = sinon.stub();
			LuxLocation.addChangeListener( listener2 );
			windowStub.addEventListener.should.be.calledOnce;
			LuxLocation.removeChangeListener( listener2 );
		} );
	} );

	describe( "navigation changes", function() {
		let listener;
		beforeEach( function() {
			listener = sinon.stub();
			LuxLocation.addChangeListener( listener );
		} );
		afterEach( function() {
			LuxLocation.removeChangeListener( listener );
		} );
		describe( "that originated from the browser", () => {
			beforeEach( () => {
				navStoreStub.wasLastChangeFromBrowser.returns( true );
			} );

			it( "should not call browserNavigated for an event without state", () => {
				const onPopState = windowStub.addEventListener.getCall( 0 ).args[ 1 ];
				onPopState( {} );
				actions.browserNavigated.should.not.be.called;
			} );

			it( "should not call browserNavigated for an event with state", () => {
				const onPopState = windowStub.addEventListener.getCall( 0 ).args[ 1 ];
				const evt = {
					state: {
						path: "/path/123",
						id: 123
					}
				};
				onPopState( evt );
				actions.browserNavigated.should.be.calledOnce
					.and.calledWith( evt );
			} );

			it( "should call push when moving forward", function() {
				navStoreStub.getDirection.returns( "forward" );
				navStoreStub.getFullPath.returns( "/path/123" );

				LuxLocation.stores.onChange();
				windowStub.history.pushState.should.not.be.called;

				listener.should.be.calledOnce.and.calledWith( {
					path: "/path/123", type: "push"
				} );
			} );
			it( "should call pop when moving back", function() {
				navStoreStub.getDirection.returns( "back" );
				navStoreStub.getFullPath.returns( "/path" );

				LuxLocation.stores.onChange();
				windowStub.history.back.should.not.be.called;

				listener.should.be.calledOnce.and.calledWith( {
					path: "/path", type: "pop"
				} );
			} );
		} );
		describe( "that did not originate from the browser", () => {
			beforeEach( () => {
				navStoreStub.wasLastChangeFromBrowser.returns( false );
			} );

			it( "should call push when moving forward", function() {
				navStoreStub.getDirection.returns( "forward" );
				navStoreStub.getFullPath.returns( "/path/123" );
				navStoreStub.getHistoryEntry.returns( { path: "/path/123", id: 123 } );

				LuxLocation.stores.onChange();
				windowStub.history.pushState.should.be.calledOnce
					.and.calledWith( { path: "/path/123", id: 123 }, "", "/path/123" );

				listener.should.be.calledOnce.and.calledWith( {
					path: "/path/123", type: "push"
				} );
			} );
			it( "should call pop when moving back", function() {
				navStoreStub.getDirection.returns( "back" );
				navStoreStub.getFullPath.returns( "/path" );
				navStoreStub.getHistoryEntry.returns( { path: "/path/123", id: 234 } );

				LuxLocation.stores.onChange();
				windowStub.history.back.should.be.calledOnce;

				listener.should.be.calledOnce.and.calledWith( {
					path: "/path", type: "pop"
				} );
			} );
		} );
	} );

	describe( "listeners", function() {
		it( "should add and remove listeners", function() {
			var listener = sinon.stub();
			LuxLocation.addChangeListener( listener );

			navStoreStub.getDirection.returns( "forward" );
			navStoreStub.getFullPath.returns( "/path/123" );
			navStoreStub.getHistoryEntry.returns( { path: "/path/123" } );

			LuxLocation.stores.onChange();

			listener.should.be.calledOnce;

			listener.reset();

			LuxLocation.removeChangeListener( listener );

			LuxLocation.stores.onChange();

			listener.should.not.be.called;
		} );
	} );
} );
