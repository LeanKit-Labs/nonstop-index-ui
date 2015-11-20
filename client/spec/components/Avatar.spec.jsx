import Avatar from "Avatar";

describe( "Avatar", () => {
	let component, container;

	beforeEach( () => {
		container = document.createElement( "div" );
	} );

	function render( props ) {
		ReactDOM.render( <Avatar {...props} />, container );
		component = container.children[ 0 ];
	}

	describe( "when handling props", () => {
		it( "should have default props", () => {
			render();

			component.nodeName.toLowerCase().should.equal( "img" );
			component.src.should.equal( "https://avatars.githubusercontent.com/anonymous?s=16" );
			component.className.should.equal( "avatar" );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			render( {
				owner: "LeanKit-Labs",
				size: 20,
				className: "new-class"
			} );

			component.nodeName.toLowerCase().should.equal( "img" );
			component.src.should.equal( "https://avatars.githubusercontent.com/LeanKit-Labs?s=20" );
			component.className.should.equal( "new-class" );
		} );
	} );
} );
