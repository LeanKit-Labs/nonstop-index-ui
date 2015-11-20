import Logo from "Logo";

describe( "Logo", () => {
	let component;

	function render( props = {} ) {
		component = ReactUtils.renderIntoDocument( <Logo {...props} /> );
	}

	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
			component = null;
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			render();
			component.props.should.eql( {
				className: ""
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			render();
			ReactDOM.findDOMNode( component ).nodeName.toLowerCase().should.equal( "svg" );
		} );

		it( "should apply the proper default class", () => {
			render();
			let className = ReactDOM.findDOMNode( component ).className;
			className = className.baseVal || className;
			className.should.equal( "ns-logo" );
		} );

		it( "should apply the class from props", () => {
			render( { className: "my-logo" } );
			let className = ReactDOM.findDOMNode( component ).className;
			className = className.baseVal || className;
			className.should.equal( "ns-logo my-logo" );
		} );
	} );
} );
