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
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			component.props.should.eql( {
				className: ""
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			component.getDOMNode().nodeName.toLowerCase().should.equal( "svg" );
		} );

		it( "should apply the proper default class", () => {
			let className = component.getDOMNode().className;
			className = className.baseVal || className;
			className.should.equal( "ns-logo" );
		} );

		it( "should apply the class from props", () => {
			component.setProps( { className: "my-logo" } );
			let className = component.getDOMNode().className;
			className = className.baseVal || className;
			className.should.equal( "ns-logo my-logo" );
		} );
	} );
} );
