import projectDetailHeaderFactory from "inject!ProjectDetailHeader";

describe( "ProjectDetailHeader", () => {
	let component, components, dependencies, ProjectDetailHeader, selectBranchStub, selectOwnerStub;

	beforeEach( () => {
		let Dropdown = getMockReactComponent( "Dropdown" );
		Dropdown.Toggle = getMockReactComponent( "Dropdown.Toggle" );
		Dropdown.Menu = getMockReactComponent( "Dropdown.Menu" );

		components = {
			Dropdown: Dropdown,
			MenuItem: getMockReactComponent( "MenuItem" )
		};

		dependencies = {
			"react-bootstrap/lib/Dropdown": components.Dropdown,
			"react-bootstrap/lib/MenuItem": components.MenuItem
		};

		ProjectDetailHeader = projectDetailHeaderFactory( dependencies );
	} );

	function createComponent( props = {} ) {
		selectBranchStub = sinon.stub();
		selectOwnerStub = sinon.stub();

		_.defaults( props, {
			branch: "branch",
			branches: [ "branch", "other-branch" ],
			name: "project",
			onSelectBranch: selectBranchStub,
			onSelectOwner: selectOwnerStub,
			owner: "owner",
			owners: [ { name: "owner" }, { name: "other-owner" } ]
		} );
		component = ReactUtils.renderIntoDocument( <ProjectDetailHeader {...props} /> );
	}

	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
			component = null;
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			createComponent();
			component.props.should.contain( {
				className: ""
			} );
		} );
	} );

	describe( "when rendering with multiple owners and branches", () => {
		beforeEach( () => {
			createComponent();
		} );

		it( "should render the name of the project", () => {
			const title = ReactUtils.findRenderedDOMComponentWithClass( component, "projectDetailHeader-repoName" );
			title.textContent.trim().should.equal( "project" );
		} );

		it( "should render both dropdowns", () => {
			const dropdowns = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown );
			dropdowns.should.have.lengthOf( 2 );
		} );

		describe( "the branch dropdown", () => {
			let branchDropdown;
			beforeEach( () => {
				branchDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 1 ];
			} );
			it( "should render the current branch in the button", () => {
				const toggle = ReactUtils.findRenderedComponentWithType( branchDropdown, components.Dropdown.Toggle );
				const text = ReactDOM.findDOMNode( toggle ).textContent;
				text.should.contain( "branch: branch" );
			} );
			it( "should render the branch choices in the menu", () => {
				const items = ReactUtils.scryRenderedComponentsWithType( branchDropdown, components.MenuItem );
				items.should.have.lengthOf( 2 );
				ReactDOM.findDOMNode( items[ 0 ] ).textContent.should.contain( "branch" );
				ReactDOM.findDOMNode( items[ 1 ] ).textContent.should.contain( "other-branch" );
			} );
		} );

		describe( "the owners dropdown", () => {
			let ownersDropdown;
			beforeEach( () => {
				ownersDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 0 ];
			} );
			it( "should render the current owner in the button", () => {
				const toggle = ReactUtils.findRenderedComponentWithType( ownersDropdown, components.Dropdown.Toggle );
				const text = ReactDOM.findDOMNode( toggle ).textContent;
				text.should.contain( "owner" );
			} );
			it( "should render the branch choices in the menu", () => {
				const items = ReactUtils.scryRenderedComponentsWithType( ownersDropdown, components.MenuItem );
				items.should.have.lengthOf( 2 );
				ReactDOM.findDOMNode( items[ 0 ] ).textContent.should.contain( "owner" );
				ReactDOM.findDOMNode( items[ 1 ] ).textContent.should.contain( "other-owner" );
			} );
		} );
	} );

	describe( "when rendering with single owner and branch", () => {
		beforeEach( () => {
			createComponent( {
				branches: [ "branch" ],
				owners: [ { name: "owner" } ]
			} );
		} );

		describe( "the branch dropdown", () => {
			let branchDropdown;
			beforeEach( () => {
				branchDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 1 ];
			} );
			it( "should not show the caret and be disabled", () => {
				const toggle = ReactUtils.findRenderedComponentWithType( branchDropdown, components.Dropdown.Toggle );
				toggle.props.noCaret.should.be.true;
				toggle.props.disabled.should.be.true;
			} );
		} );

		describe( "the owners dropdown", () => {
			let ownersDropdown;
			beforeEach( () => {
				ownersDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 0 ];
			} );
			it( "should not show the caret and be disabled", () => {
				const toggle = ReactUtils.findRenderedComponentWithType( ownersDropdown, components.Dropdown.Toggle );
				toggle.props.noCaret.should.be.true;
				toggle.props.disabled.should.be.true;
			} );
		} );
	} );

	describe( "when clicking on a branch", () => {
		let branchItem;
		beforeEach( () => {
			createComponent();
			const branchDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 1 ];
			branchItem = ReactUtils.scryRenderedComponentsWithType( branchDropdown, components.MenuItem )[ 1 ];
		} );

		it( "should pass it on to the onSelectBranch prop", () => {
			branchItem.props.onSelect();
			selectBranchStub.should.be.calledOnce.and.calledWith( "other-branch" );
		} );
	} );

	describe( "when clicking on an owner", () => {
		let ownerItem;
		beforeEach( () => {
			createComponent();
			const ownerDropdown = ReactUtils.scryRenderedComponentsWithType( component, components.Dropdown )[ 0 ];
			ownerItem = ReactUtils.scryRenderedComponentsWithType( ownerDropdown, components.MenuItem )[ 1 ];
		} );

		it( "should pass it on to the onSelectOwner prop", () => {
			ownerItem.props.onSelect();
			selectOwnerStub.should.be.calledOnce.and.calledWith( { name: "other-owner" } );
		} );
	} );
} );
