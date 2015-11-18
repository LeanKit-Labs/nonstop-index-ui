import projectDetailFactory from "inject!ProjectDetail";

describe( "ProjectDetail Component", () => {
	let component, dependencies, actions, ProjectDetail;

	beforeEach( () => {
		actions = {
			viewProject: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {
			ProjectDetailHeader: getMockReactComponent( "ProjectDetailHeader" ),
			VersionGroup: getMockReactComponent( "VersionGroup" ),
			"stores/projectStore": {
				getProject: sinon.stub().returns( {
					branches: [],
					owners: [],
					versions: {}
				} ),
				getHosts: sinon.stub().returns( [] )
			}
		};
		ProjectDetail = projectDetailFactory( dependencies );
	} );

	function createComponent( props = {} ) {
		if ( !props.params ) {
			props.params = { name: "project", owner: "owner", branch: "branch" };
		}
		component = ReactUtils.renderIntoDocument( <ProjectDetail {...props} /> );
	}

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
			component = null;
		}
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			createComponent();
			component.state.should.eql( {
				branches: [],
				owners: [],
				versions: {},
				allHosts: []
			} );
		} );

		it( "should pass name, owner, and branch to store", () => {
			createComponent( {
				params: {
					name: "name",
					owner: "owner",
					branch: "branch"
				}
			} );
			dependencies[ "stores/projectStore" ].getProject.should.be.calledOnce
				.and.calledWith( "name", "owner", "branch" );
		} );

		describe( "when receiving new props", () => {
			beforeEach( () => {
				createComponent();
				dependencies[ "stores/projectStore" ].getProject.returns( {
					branches: [ "new-branch" ],
					owners: [],
					versions: {}
				} );
				component.setProps( {
					params: { name: "new-project", owner: "new-owner", branch: "branch" }
				} );
			} );

			it( "should update state when receiving new props", () => {
				component.state.branches.should.eql( [ "new-branch" ] );
			} );
		} );
	} );

	describe( "when handling store changes", () => {
		it( "should update state", () => {
			createComponent();
			dependencies[ "stores/projectStore" ].getProject.returns( {
				branches: [ "new-branch" ],
				owners: [],
				versions: {}
			} );
			postal.channel( "lux.store" ).publish( "project.changed" );
			component.state.branches.should.eql( [ "new-branch" ] );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render a ProjectDetailHeader", () => {
			createComponent();
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			should.exist( pdh );
		} );
		it( "should render a VersionGroup", () => {
			createComponent();
			const vg = ReactUtils.findRenderedComponentWithType( component, dependencies.VersionGroup );
			should.exist( vg );
		} );
	} );

	describe( "when selecting a branch", () => {
		beforeEach( () => {
			const params = {
				name: "name",
				owner: "owner",
				branch: "branch"
			};
			createComponent( { params } );
		} );
		it( "should trigger viewProject with the same project and owner", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectBranch( "new-branch" );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "owner",
					branch: "new-branch"
				} );
		} );
	} );

	describe( "when selecting an owner", () => {
		beforeEach( () => {
			const params = {
				name: "name",
				owner: "owner",
				branch: "branch"
			};
			createComponent( { params } );
		} );
		it( "should trigger viewProject with the same project and branch if available", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectOwner( { name: "new-owner", branches: [ "branch" ] } );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "new-owner",
					branch: "branch"
				} );
		} );
		it( "should trigger viewProject with the same project and first branch of the owner if the current branch is not present", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectOwner( { name: "new-owner", branches: [ "other-branch", "the-branch" ] } );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "new-owner",
					branch: "other-branch"
				} );
		} );
	} );
} );
