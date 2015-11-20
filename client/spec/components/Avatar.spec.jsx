import Avatar from "Avatar";

describe( "Avatar", () => {
	let img, container;

	beforeEach( () => {
		container = document.createElement( "div" );
	} );

	function render( props ) {
		ReactDOM.render( <Avatar {...props} />, container );
		img = container.children[ 0 ];
	}

	describe( "when handling props", () => {
		it( "should have default props", () => {
			render();

			img.nodeName.toLowerCase().should.equal( "img" );
			img.src.should.equal( "https://avatars.githubusercontent.com/anonymous?s=16" );
			img.className.should.equal( "avatar" );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			render( {
				owner: "LeanKit-Labs",
				size: 20,
				className: "new-class"
			} );

			img.nodeName.toLowerCase().should.equal( "img" );
			img.src.should.equal( "https://avatars.githubusercontent.com/LeanKit-Labs?s=20" );
			img.className.should.equal( "new-class" );
		} );
	} );
} );
