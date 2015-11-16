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
			React.unmountComponentAtNode( component.getDOMNode().parentNode );
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
			title.getDOMNode().textContent.should.equal( "Projects" );
		} );
		it( "should render projects", () => {
			component.setProps( {
				projects: [
					{ name: "project-one" },
					{ name: "project-two" },
					{ name: "project-three" }
				]
			} );

			const items = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item" );
			const headings = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item-heading" );

			items.should.have.lengthOf( 3 );

			headings[0].getDOMNode().textContent.should.equal( "project-one" );
			headings[1].getDOMNode().textContent.should.equal( "project-two" );
			headings[2].getDOMNode().textContent.should.equal( "project-three" );
		} );
	} );

	describe( "when clicking on a project", () => {
		beforeEach( function() {
			component.setProps( {
				projects: [
					{ name: "project-one" },
					{ name: "project-two" },
					{ name: "project-three" }
				]
			} );
		} );
		it( "should trigger onSelectProject with the project name", () => {
			let items = ReactUtils.scryRenderedDOMComponentsWithClass( component, "list-group-item" );

			ReactUtils.Simulate.click( items[ 1 ].getDOMNode() );

			selectStub.should.be.calledOnce.and.calledWith( "project-two" );
		} );
	} );
} );
