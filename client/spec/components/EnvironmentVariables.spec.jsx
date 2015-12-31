import environmentVariablesFactory from "inject!EnvironmentVariables";
import { defaultState, loadingState, loadedState, errorState, emptyState } from "../data/envVarExpectedState";
import postal from "postal";

describe( "EnvironmentVariables", () => {
	let component, dependencies, actions, EnvironmentVariables, container;

	beforeEach( () => {
		actions = {
			clearEnvVarChoice: sinon.stub()
		};

		lux.customActionCreator( actions );

		const Modal = getMockReactComponent( "Modal" );
		Modal.Header = getMockReactComponent( "Modal.Header" );
		Modal.Title = getMockReactComponent( "Modal.Title" );
		Modal.Body = getMockReactComponent( "Modal.Body" );
		Modal.Footer = getMockReactComponent( "Modal.Footer" );

		dependencies = {
			"stores/envVarStore": {
				getEnvironmentInfo: sinon.stub().returns( defaultState )
			},
			"react-bootstrap/lib": {
				Alert: getMockReactComponent( "Alert" ),
				Modal,
				Button: getMockReactComponent( "Button" ),
				Table: React.createClass( {
					render() {
						return <table className="component-table"> table { this.props.children }</table>;
					}
				} )
			}
		};

		EnvironmentVariables = environmentVariablesFactory( dependencies );
		container = document.createElement( "div" );
	} );

	function createComponent( props = {} ) {
		component = ReactDOM.render( <EnvironmentVariables {...props} />, container );
	}

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
			component = null;
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			createComponent();
			component.props.should.eql( {} );
		} );
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			createComponent();
			should.equal( component.state, defaultState );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the host in the title", () => {
			dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( loadingState );
			createComponent();
			const title = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Title );
			ReactDOM.findDOMNode( title ).textContent.should.contain( loadingState.host );
		} );

		it( "should render the footer", () => {
			createComponent();
			const footer = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer );
			should.exist( footer );
			should.exist(
				ReactUtils.findRenderedComponentWithType( footer, dependencies[ "react-bootstrap/lib" ].Button )
			);
		} );

		describe( "when environment info is loading", () => {
			it( "should render the loading spinner", () => {
				dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( loadingState );
				createComponent();
				should.exist(
					ReactUtils.findRenderedDOMComponentWithClass( component, "spinner" )
				);
			} );
		} );

		describe( "when environment info has loaded", () => {
			it( "should render the table of env vars", () => {
				dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( loadedState );
				createComponent();
				const body = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Body );
				const table = ReactDOM.findDOMNode( ReactUtils.findRenderedComponentWithType( body, dependencies[ "react-bootstrap/lib" ].Table ) );
				const rows = table.querySelectorAll( "tbody tr" );
				rows[ 0 ].children[ 0 ].textContent.should.equal( "thangy" );
				rows[ 0 ].children[ 1 ].textContent.should.equal( "thang" );
				rows[ 1 ].children[ 0 ].textContent.should.equal( "thingy" );
				rows[ 1 ].children[ 1 ].textContent.should.equal( "thing" );
				rows[ 2 ].children[ 0 ].textContent.should.equal( "thungy" );
				rows[ 2 ].children[ 1 ].textContent.should.equal( "thung" );
			} );
		} );

		describe( "when environment info has failed to load", () => {
			it( "should render the warning notice", () => {
				dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( errorState );
				createComponent();
				const alertComp = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Alert );
				should.exist( alertComp );
				ReactDOM.findDOMNode( alertComp ).textContent.should.contain( "Unable to load environment information for this host." );
			} );
		} );

		describe( "when environment info is empty", () => {
			it( "should render the error notice", () => {
				dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( emptyState );
				createComponent();
				const alertComp = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Alert );
				should.exist( alertComp );
				ReactDOM.findDOMNode( alertComp ).textContent.should.contain( "No environment variables are set for this host." );
			} );
		} );
	} );

	describe( "when clicking close", () => {
		it( "should close the modal", () => {
			dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( loadedState );
			createComponent();
			const button = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Button );
			button.props.onClick();
			lux.actions.clearEnvVarChoice.should.be.calledOnce;
		} );
	} );

	describe( "when the environment store emits change events", () => {
		it( "should call setState on the component", () => {
			dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( loadedState );
			createComponent();
			component.setState = sinon.stub();
			dependencies[ "stores/envVarStore" ].getEnvironmentInfo = sinon.stub().returns( defaultState );
			postal.publish( {
				channel: "lux.store",
				topic: "environment.changed",
				data: {}
			} );
			component.setState.should.be.calledOnce;
		} );
	} );
} );
