import logoFactory from "inject!Logo";

describe( "Logo", () => {
	let component, dependencies;

	beforeEach( () => {
		dependencies = {};

		const Logo = logoFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <Logo /> );
	} );

	afterEach( () => {
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
} );
