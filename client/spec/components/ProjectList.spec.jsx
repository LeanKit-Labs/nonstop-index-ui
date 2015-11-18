import projectListFactory from "inject!ProjectList";

describe( "ProjectList", () => {
	let component, dependencies, selectStub;

	beforeEach( () => {
		dependencies = {};
		const ProjectList = projectListFactory( dependencies );
		selectStub = sinon.stub();
		component = ReactUtils.renderIntoDocument( <ProjectList projects={ [] } onSelectProject={ selectStub } /> );
	} );

	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			component.props.should.contain( {
				title: "Projects"
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render a title", () => {
			const title = ReactUtils.findRenderedDOMComponentWithClass( component, "box-title" );
			title.getDOMNode().textContent.trim().should.equal( "Projects" );
		} );
		it( "should render projects", () => {
			component.setProps( {
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

			headings[0].getDOMNode().textContent.should.equal( "project-one" );
			headings[1].getDOMNode().textContent.should.equal( "project-two" );
			headings[2].getDOMNode().textContent.should.equal( "project-three" );

			details[0].getDOMNode().textContent.trim().should.equal( "owner-one/branch-one" );
			details[1].getDOMNode().textContent.trim().should.equal( "owner-two/branch-two" );
			details[2].getDOMNode().textContent.trim().should.equal( "owner-three/branch-three" );
		} );
	} );

	describe( "when clicking on a project", () => {
		let projects;

		beforeEach( function() {
			projects = [
				{ name: "project-one", owner: "owner", branch: "master" },
				{ name: "project-two", owner: "owner", branch: "master" },
				{ name: "project-three", owner: "owner", branch: "master" }
			];
			component.setProps( { projects } );
		} );
		it( "should trigger onSelectProject with the project name", () => {
			let items = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item" );

			ReactUtils.Simulate.click( items[ 1 ].getDOMNode() );

			selectStub.should.be.calledOnce.and.calledWith( projects[ 1 ] );
		} );
	} );
} );
