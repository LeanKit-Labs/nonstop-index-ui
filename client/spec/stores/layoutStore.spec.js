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
			layoutStore.getState().should.eql( { } );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling noop", () => {
			it( "should not edit the state", () => {
				lux.publishAction( "noop" );
				const state = layoutStore.getState();
				state.should.be.empty;
			} );
		} );
	} );

	describe( "helper functions", () => {
		it( "should provide an example getter", () => {
			layoutStore.getExample().should.be.empty;
		} );
	} );
} );
