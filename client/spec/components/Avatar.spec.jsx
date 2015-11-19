import avatarFactory from "inject!Avatar";
import ReactDOM from "react-dom";

describe( "Avatar", () => {
	let component, dependencies;

	beforeEach( () => {
		dependencies = {};

		const Avatar = avatarFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <Avatar /> );
	} );

	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			component.props.should.eql( {
				owner: "anonymous",
				size: 16,
				className: "avatar"
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			const node = component.getDOMNode();

			component.setProps( {
				owner: "LeanKit-Labs",
				size: 20,
				className: "new-class"
			} );

			node.nodeName.toLowerCase().should.equal( "img" );
			node.src.should.equal( "https://avatars.githubusercontent.com/LeanKit-Labs?s=20" );
			node.className.should.equal( "new-class" );
		} );
	} );
} );
