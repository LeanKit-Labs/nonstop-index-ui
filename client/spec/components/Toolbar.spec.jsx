import toolbarFactory from "inject!Toolbar";

describe( "Toolbar", () => {
	let component, dependencies, actions;

	beforeEach( () => {
		actions = {
			exampleAction: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {
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
			React.unmountComponentAtNode( component.getDOMNode().parentNode );
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
		it( "should render properly", () => {
			component.getDOMNode().nodeName.toLowerCase().should.equal( "div" );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the example action", () => {
			component.exampleAction();
			lux.actions.exampleAction.should.be.calledOnce;
		} );
	} );
} );
