import projectStoreFactory from "inject!stores/projectStore";

describe( "project store", () => {
	let projectStore;

	beforeEach( () => {
		projectStore = projectStoreFactory( {} );
	} );

	afterEach( () => {
		projectStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			projectStore.getState().should.eql( { } );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling noop", () => {
			it( "should not edit the state", () => {
				lux.publishAction( "noop" );
				const state = projectStore.getState();
				state.should.be.empty;
			} );
		} );
	} );

	describe( "helper functions", () => {
		it( "should provide an example getter", () => {
			projectStore.getExample().should.be.empty;
		} );
	} );
} );
