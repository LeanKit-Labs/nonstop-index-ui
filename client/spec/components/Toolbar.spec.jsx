import toolbarFactory from "inject!Toolbar";

describe( "Toolbar", () => {
	let component, dependencies, actions, featureOptions, components;

	beforeEach( () => {
		actions = {
			viewHome: sinon.stub(),
			viewConfigurator: sinon.stub()
		};

		lux.customActionCreator( actions );

		featureOptions = {
			config: true
		};

		const Dropdown = getMockReactComponent( "Dropdown" );
		Dropdown.Toggle = getMockReactComponent( "Dropdown.Toggle" );
		Dropdown.Menu = getMockReactComponent( "Dropdown.Menu" );

		components = {
			Dropdown,
			MenuItem: getMockReactComponent( "MenuItem" )
		};

		dependencies = {
			Logo: getMockReactComponent( "Logo" ),
			"react-bootstrap/lib/Dropdown": components.Dropdown,
			"stores/layoutStore": {
				getState: sinon.stub().returns( {} )
			},
			"stores/userStore": {
				getUser: sinon.stub().returns( {
					displayName: "User Name"
				} )
			},
			"../../clientConfig": { featureOptions }
		};

		const Toolbar = toolbarFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <Toolbar /> );
	} );

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			component.props.should.eql( {} );
		} );
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			component.state.should.eql( {
				user: {
					displayName: "User Name"
				}
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the logo", () => {
			const logo = ReactUtils.findRenderedComponentWithType( component, dependencies.Logo );
			should.exist( logo );
		} );

		it( "should render configuration when feature is turned on", () => {
			component.refs.configLink.textContent.should.contain( "Configuration" );
		} );

		it( "should not render configuration when feature is turned off", () => {
			featureOptions.config = false;
			component.forceUpdate();

			should.equal( component.refs.configLink, undefined );
		} );

		it( "should render a user menu", () => {
			const dropdown = ReactUtils.findRenderedComponentWithType( component, components.Dropdown );
			ReactDOM.findDOMNode( dropdown ).textContent.should.contain( "User Name" );
		} );
	} );

	describe( "when handling store changes", () => {
		it( "should update state", () => {
			dependencies[ "stores/layoutStore" ].getState.returns( { newState: true } );
			dependencies[ "stores/userStore" ].getUser.returns( { username: "username" } );
			postal.channel( "lux.store" ).publish( "layout.changed" );
			component.state.should.eql( {
				newState: true,
				user: {
					username: "username"
				}
			} );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the example action", () => {
			const logo = ReactUtils.findRenderedDOMComponentWithClass( component, "logo" );
			ReactUtils.Simulate.click( logo );
			lux.actions.viewHome.should.be.calledOnce;
		} );

		it( "should trigger viewConfigurator on configuration link", () => {
			ReactUtils.Simulate.click( component.refs.configLink );
			lux.actions.viewConfigurator.should.be.calledOnce;
		} );
	} );
} );
