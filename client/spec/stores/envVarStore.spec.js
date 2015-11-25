import envVarStoreFactory from "inject!stores/envVarStore";

import { envResponseBody, loadEnvironmentForHostActionState } from "../data/envVarRawState";
import { defaultState, loadingState, loadedState, errorState } from "../data/envVarExpectedState";

describe( "environment variable store", () => {
	let envVarStore;

	beforeEach( () => {
		envVarStore = envVarStoreFactory( {} );
	} );

	afterEach( () => {
		envVarStore.dispose();
	} );

	describe( "when initializing", () => {
		it( "should add default state", () => {
			envVarStore.getState().should.eql( defaultState );
		} );
	} );

	describe( "handlers", () => {
		describe( "when handling loadEnvironmentForHost", () => {
			beforeEach( () => {
				lux.publishAction( "loadEnvironmentForHost", loadEnvironmentForHostActionState );
			} );
			it( "should store set state with name and loading status", () => {
				const state = envVarStore.getState();
				state.should.eql( loadingState );
			} );
		} );

		describe( "when handling loadEnvironmentForHostSuccess", () => {
			beforeEach( () => {
				lux.publishAction( "loadEnvironmentForHost", loadEnvironmentForHostActionState );
				lux.publishAction( "loadEnvironmentForHostSuccess", envResponseBody );
			} );
			it( "should store environment variables in state", () => {
				envVarStore.getState().should.eql( loadedState );
			} );
		} );

		describe( "when handling loadEnvironmentForHostError", () => {
			beforeEach( () => {
				lux.publishAction( "loadEnvironmentForHost", loadEnvironmentForHostActionState );
				lux.publishAction( "loadEnvironmentForHostError" );
			} );
			it( "should set status to error", () => {
				envVarStore.getState().should.eql( errorState );
			} );
		} );

		describe( "when handling clearEnvVarChoice", () => {
			beforeEach( () => {
				lux.publishAction( "loadEnvironmentForHost", loadEnvironmentForHostActionState );
				lux.publishAction( "loadEnvironmentForHostSuccess", envResponseBody );
				lux.publishAction( "clearEnvVarChoice" );
			} );
			it( "should clear state of any host environment info", () => {
				envVarStore.getState().should.eql( defaultState );
			} );
		} );
	} );

	describe( "when calling getEnvironmentInfo", () => {
		beforeEach( () => {
			lux.publishAction( "loadEnvironmentForHost", loadEnvironmentForHostActionState );
			lux.publishAction( "loadEnvironmentForHostSuccess", envResponseBody );
		} );
		it( "should return expected state", () => {
			envVarStore.getEnvironmentInfo().should.eql( loadedState );
		} );
	} );
} );
