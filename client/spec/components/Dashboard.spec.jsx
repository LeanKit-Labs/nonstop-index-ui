import dashboardFactory from "inject!Dashboard";

describe( "Dashboard", () => {
	let component, dependencies;

	beforeEach( () => {
		dependencies = {};

		const Dashboard = dashboardFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <Dashboard /> );
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
		it( "should render the title", () => {
			const header = ReactUtils.findRenderedDOMComponentWithClass( component, "content-header" );
			const title = ReactUtils.findRenderedDOMComponentWithClass( header, "text-primary" );
			title.getDOMNode().textContent.trim().should.equal( "Dashboard" );
		} );
	} );
} );
