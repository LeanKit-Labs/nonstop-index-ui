import toolbarFactory from "inject!Toolbar";

describe( "Toolbar", () => {
	let component, dependencies, actions;

	beforeEach( () => {
		actions = {
			viewHome: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {
			Logo: getMockReactComponent( "Logo" ),
			"stores/layoutStore": {
				getState: sinon.stub().returns( {} )
			}
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
			component.state.should.eql( {} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the logo", () => {
			const logo = ReactUtils.findRenderedComponentWithType( component, dependencies.Logo );
			should.exist( logo );
		} );
	} );

	describe( "when handling store changes", () => {
		it( "should update state", () => {
			dependencies[ "stores/layoutStore" ].getState.returns( { newState: true } );
			postal.channel( "lux.store" ).publish( "layout.changed" );
			component.state.should.eql( {
				newState: true
			} );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the example action", () => {
			const logo = ReactUtils.findRenderedDOMComponentWithClass( component, "logo" );
			ReactUtils.Simulate.click( logo );
			lux.actions.viewHome.should.be.calledOnce;
		} );
	} );
} );
