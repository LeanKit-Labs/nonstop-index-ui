import userStoreFactory from "inject!stores/userStore";

describe( "user store", () => {
	let userStore;

	beforeEach( () => {
		userStore = userStoreFactory( {} );
	} );

	afterEach( () => {
		userStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			userStore.getState().should.eql( {
				_json: {}
			} );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling loadUserSuccess", () => {
			it( "should store the result", () => {
				lux.publishAction( "loadUserSuccess", {
					username: "name",
					_json: {}
				} );
				const state = userStore.getState();
				state.should.be.eql( {
					username: "name",
					_json: {}
				} );
			} );
		} );

		describe( "when handling loadUserFailure", () => {
			it( "should not throw an exception", () => {
				lux.publishAction.bind( lux, "loadUserFailure", {} ).should.not.throw();
			} );
		} );
	} );

	describe( "when calling getUser", () => {
		beforeEach( () => {
			Object.assign( userStore.getState(), {
				displayName: "User Name",
				username: "username",
				profileUrl: "url",
				_json: {
					company: "Company"
				}
			} );
		} );
		it( "should provide a getUser method", () => {
			userStore.getUser().should.eql( {
				displayName: "User Name",
				username: "username",
				profileUrl: "url",
				company: "Company"
			} );
		} );
	} );
} );
