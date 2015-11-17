import versionGroupFactory from "inject!VersionGroup";

describe.skip( "VersionGroup", () => {
	let component, dependencies;

	beforeEach( () => {
		dependencies = {};

		const VersionGroup = versionGroupFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <VersionGroup /> );
	} );

	afterEach( () => {
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
		it( "should render properly", () => {
			component.getDOMNode().nodeName.toLowerCase().should.equal( "div" );
		} );
	} );
} );
