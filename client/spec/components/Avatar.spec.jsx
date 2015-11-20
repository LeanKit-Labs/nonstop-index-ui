import Avatar from "Avatar";

describe( "Avatar", () => {
	let component;

	function render( props ) {
		component = ReactUtils.renderIntoDocument( <Avatar {...props} /> );
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
				owner: "anonymous",
				size: 16,
				className: "avatar"
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			render( {
				owner: "LeanKit-Labs",
				size: 20,
				className: "new-class"
			} );

			const node = ReactDOM.findDOMNode( component );

			node.nodeName.toLowerCase().should.equal( "img" );
			node.src.should.equal( "https://avatars.githubusercontent.com/LeanKit-Labs?s=20" );
			node.className.should.equal( "new-class" );
		} );
	} );
} );
