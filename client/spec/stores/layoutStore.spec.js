import layoutStoreFactory from "inject!stores/layoutStore";

describe( "layout store", () => {
	let layoutStore;

	beforeEach( () => {
		layoutStore = layoutStoreFactory( {} );
	} );

	afterEach( () => {
		layoutStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			layoutStore.getState().should.eql( {
				type: "success",
				message: ""
			} );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling applySettingsSuccess", () => {
			it( "should set the correct message and type", () => {
				lux.publishAction( "applySettingsSuccess" );
				layoutStore.getState().should.contain( {
					type: "success",
					message: "Successfully updated host"
				} );
			} );
		} );
		describe( "when handling handleAlertClose", () => {
			it( "should clear out the message", () => {
				layoutStore.getState().message = "Yo dog";
				lux.publishAction( "handleAlertClose" );
				layoutStore.getState().message.should.be.empty;
			} );
		} );
	} );

	describe( "helper functions", () => {
		describe( "getAlert", () => {
			it( "should return an alert object if message is present", () => {
				layoutStore.getState().message = "Yo dog";
				layoutStore.getAlert().should.eql( {
					message: "Yo dog",
					type: "success"
				} );
			} );
			it( "should return null if no message is present", () => {
				should.equal( layoutStore.getAlert(), null );
			} );
		} );
	} );
} );
