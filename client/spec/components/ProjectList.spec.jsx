import projectListFactory from "inject!ProjectList";

describe( "ProjectList", () => {
	let component, dependencies, selectStub, ProjectList;

	beforeEach( () => {
		dependencies = {};
		ProjectList = projectListFactory( dependencies );
		selectStub = sinon.stub();
	} );

	function render( props = {} ) {
		component = ReactUtils.renderIntoDocument( <ProjectList projects={ [] } onSelectProject={ selectStub } {...props} /> );
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
			component.props.should.contain( {
				title: "Projects"
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render a title", () => {
			render();
			const title = ReactUtils.findRenderedDOMComponentWithClass( component, "box-title" );
			title.textContent.trim().should.equal( "Projects" );
		} );
		it( "should render projects", () => {
			render( {
				projects: [
					{ name: "project-one", owner: "owner-one", branch: "branch-one" },
					{ name: "project-two", owner: "owner-two", branch: "branch-two" },
					{ name: "project-three", owner: "owner-three", branch: "branch-three" }
				]
			} );

			const items = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item" );
			const headings = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item-heading" );
			const details = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item-text" );

			items.should.have.lengthOf( 3 );

			items[ 0 ].getAttribute( "href" ).should.equal( "/nonstop/project/project-one/owner-one/branch-one" );
			items[ 1 ].getAttribute( "href" ).should.equal( "/nonstop/project/project-two/owner-two/branch-two" );
			items[ 2 ].getAttribute( "href" ).should.equal( "/nonstop/project/project-three/owner-three/branch-three" );

			headings[ 0 ].textContent.should.equal( "project-one" );
			headings[ 1 ].textContent.should.equal( "project-two" );
			headings[ 2 ].textContent.should.equal( "project-three" );

			details[ 0 ].textContent.trim().should.equal( "owner-one/branch-one" );
			details[ 1 ].textContent.trim().should.equal( "owner-two/branch-two" );
			details[ 2 ].textContent.trim().should.equal( "owner-three/branch-three" );
		} );
	} );

	describe( "when clicking on a project", () => {
		let projects;

		beforeEach( () => {
			projects = [
				{ name: "project-one", owner: "owner", branch: "master" },
				{ name: "project-two", owner: "owner", branch: "master" },
				{ name: "project-three", owner: "owner", branch: "master" }
			];
			render( { projects } );
		} );
		it( "should trigger onSelectProject with the project name", () => {
			const items = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item" );

			ReactUtils.Simulate.click( items[ 1 ] );

			selectStub.should.be.calledOnce.and.calledWith( projects[ 1 ] );
		} );
	} );
} );
