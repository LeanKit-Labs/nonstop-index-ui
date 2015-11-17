import appFactory from "inject!app";

describe( "app", () => {
	let promiseStub, errorHandlerStub;

	beforeEach( () => {
		errorHandlerStub = {
			handleRejection: _.noop,
			handleException: _.noop
		};

		promiseStub = {};

		// Initialize factory
		appFactory( {
			react: {},
			jquery: {},
			when: {
				Promise: promiseStub
			},
			"stores/projectStore": {},
			"stores/navigationStore": {},
			"infrastructure/errorHandler": errorHandlerStub,
			"infrastructure/api": {},
			"infrastructure/router": {}
		} );
	} );

	describe( "logging unhandled promise rejections", () => {
		it( "should add a handler to when's onPotentiallyUnhandledRejection property", () => {
			promiseStub.onPotentiallyUnhandledRejection.should.equal( errorHandlerStub.handleRejection );
		} );
	} );

	describe( "logging unhandled exceptions", () => {
		let existingOnError;

		before( () => {
			existingOnError = window.onerror;
		} );

		after( () => {
			window.onerror = existingOnError;
		} );

		it( "should attach an onerror handler to the window", () => {
			window.onerror.should.equal( errorHandlerStub.handleException );
		} );
	} );
} );
