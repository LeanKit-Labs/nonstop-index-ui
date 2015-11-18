import projectDetailFactory from "inject!ProjectDetail";

describe.skip( "ProjectDetail", () => {
	let component, dependencies, actions;

	beforeEach( () => {
		actions = {
			exampleAction: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {
			"stores/projectStore": {
				getProject: sinon.stub().returns( {
					branches: [],
					owners: [],
					versions: []
				} )
			}
		};

		const ProjectDetail = projectDetailFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <ProjectDetail params={ { name: "project", owner: "owner", branch: "branch" } } /> );
	} );

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			component.state.should.eql( {
				branches: [],
				owners: [],
				versions: []
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render properly", () => {
			component.getDOMNode().nodeName.toLowerCase().should.equal( "div" );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the example action", () => {
			component.exampleAction();
			lux.actions.exampleAction.should.be.calledOnce;
		} );
	} );
} );
