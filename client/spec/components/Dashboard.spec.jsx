import dashboardFactory from "inject!Dashboard";

describe( "Dashboard", () => {
	let component, dependencies, actions;

	beforeEach( () => {
		actions = {
			viewProject: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {
			ProjectList: getMockReactComponent( "ProjectList" ),
			"stores/projectStore": {
				getProjects: sinon.stub().returns( [] ),
				getHosts: sinon.stub().returns( [] )
			}
		};

		const Dashboard = dashboardFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <Dashboard /> );
	} );

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

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
			component.state.should.eql( {
				projects: [],
				hosts: []
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the title", () => {
			const header = ReactUtils.findRenderedDOMComponentWithClass( component, "content-header" );
			const title = header.querySelector( ".text-primary" );
			title.textContent.trim().should.equal( "Dashboard" );
		} );

		it( "should render the ProjectList", () => {
			const projList = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectList );
			should.exist( projList );
		} );
	} );

	describe( "when handling store changes", () => {
		it( "should update state", () => {
			dependencies[ "stores/projectStore" ].getProjects.returns( [ { name: "new" } ] );
			postal.channel( "lux.store" ).publish( "project.changed" );
			component.state.should.eql( {
				projects: [ { name: "new" } ],
				hosts: []
			} );
		} );
	} );

	describe( "when a project is selected", () => {
		it( "should call viewProject", () => {
			const projList = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectList );
			projList.props.onSelectProject( "core-blu" );
			actions.viewProject.should.be.calledOnce.and.calledWith( "core-blu" );
		} );
	} );
} );
