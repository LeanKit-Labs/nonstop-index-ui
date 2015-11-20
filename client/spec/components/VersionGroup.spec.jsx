import versionGroupFactory from "inject!VersionGroup";

describe( "VersionGroup", () => {
	let component, components, dependencies, VersionGroup;

	beforeEach( () => {
		components = {
			DropdownButton: getMockReactComponent( "DropdownButton" ),
			MenuItem: getMockReactComponent( "MenuItem" )
		};

		dependencies = {
			"react-bootstrap/lib/DropdownButton": components.DropdownButton,
			"react-bootstrap/lib/MenuItem": components.MenuItem
		};

		VersionGroup = versionGroupFactory( dependencies );
	} );

	function createComponent( props = {} ) {
		_.defaults( props, {
			versions: {},
			hosts: [],
			onRelease: _.noop
		} );
		component = ReactUtils.renderIntoDocument( <VersionGroup {...props} /> );
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
				className: "versionGroup"
			} );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the supplied className", () => {
			createComponent( { className: "my-class" } );
			ReactDOM.findDOMNode( component ).className.should.equal( "my-class" );
		} );

		describe( "versions", () => {
			beforeEach( () => {
				createComponent( {
					versions: {
						1: { builds: { b1: { packages: [] } } },
						2: { builds: { b2: { packages: [] } } }
					}
				} );
			} );

			it( "should render a group for each version", () => {
				const rows = ReactUtils.scryRenderedDOMComponentsWithClass( component, "row" );
				rows.should.have.lengthOf( 2 );
			} );

			it( "should render the version numbers", () => {
				const headers = ReactUtils.scryRenderedDOMComponentsWithClass( component, "header-in-tab" );
				headers[ 0 ].textContent.should.contain( "v1" );
				headers[ 1 ].textContent.should.contain( "v2" );
			} );

			it( "should render the padded build numbers", () => {
				const headers = ReactUtils.scryRenderedDOMComponentsWithClass( component, "header-in-tab" );
				headers[ 0 ].textContent.should.contain( "0001" );
				headers[ 1 ].textContent.should.contain( "0002" );
			} );
		} );

		describe( "builds and packages", () => {
			let rows, onReleaseStub;

			beforeEach( () => {
				onReleaseStub = sinon.stub();

				createComponent( {
					versions: {
						1: {
							builds: {
								b1: { packages: [
									{ file: "p01", architecture: "x86", platform: "darwin", slug: "123", owner: "ownerOne", project: "projectOne", branch: "branchOne", version: "1b1" },
									{ file: "p02", architecture: "x64", platform: "linux", slug: "234", owner: "ownerOne", project: "projectTwo", branch: "branchTwo", version: "1b1" }
								] },
								b2: { packages: [
									{ file: "p03", architecture: "x128", platform: "amd", slug: "123", owner: "ownerOne", project: "projectOne", branch: "branchOne", version: "1b2" }
								] }
							}
						}
					},
					hosts: [
						{ name: "hostOne" },
						{ name: "hostTwo" }
					],
					onRelease: onReleaseStub
				} );
				rows = ReactDOM.findDOMNode( component ).querySelectorAll( "tbody tr" );
			} );

			it( "should render a table row for each package", () => {
				rows.should.have.lengthOf( 3 );
			} );

			it( "should render the build number on the first row of each group", () => {
				rows[ 0 ].children[ 0 ].textContent.trim().should.equal( "0001" );
				rows[ 1 ].children[ 0 ].textContent.trim().should.not.equal( "0001" );
				rows[ 2 ].children[ 0 ].textContent.trim().should.equal( "0002" );
			} );

			it( "should have the build number span the right number of rows", () => {
				rows[ 0 ].children[ 0 ].rowSpan.should.equal( 2 );
				rows[ 2 ].children[ 0 ].rowSpan.should.equal( 1 );
			} );

			it( "should map known platforms to friendly names", () => {
				rows[ 0 ].textContent.should.contain( "Mac" );
				rows[ 1 ].textContent.should.contain( "Linux" );
				rows[ 2 ].textContent.should.contain( "amd" );
			} );

			it( "should map known architecture to friendly names", () => {
				rows[ 0 ].textContent.should.contain( "32 bit" );
				rows[ 1 ].textContent.should.contain( "64 bit" );
				rows[ 2 ].textContent.should.contain( "x128" );
			} );

			it( "should create a link to github for the slugs", () => {
				const link = rows[ 0 ].querySelector( "a" );
				link.href.should.equal( "https://github.com/ownerOne/projectOne/commit/123" );
				link.textContent.trim().should.equal( "123" );
			} );

			it( "should render a Deploy button for each row", () => {
				const toggles = ReactUtils.scryRenderedComponentsWithType( component, components.DropdownButton );
				toggles.should.have.lengthOf( 3 );
			} );

			it( "should render the branch choices in the menu", () => {
				const items = ReactUtils.scryRenderedComponentsWithType( component, components.MenuItem );
				items.should.have.lengthOf( 6 );

				const values = [ "hostOne", "hostTwo" ];

				_.each( [ ...values, ...values, ...values ], ( value, index ) => {
					ReactDOM.findDOMNode( items[ index ] ).textContent.should.contain( value );
				} );
			} );

			it( "should call the onRelease prop onSelect of Dropdown", () => {
				const firstToggle = ReactUtils.scryRenderedComponentsWithType( component, components.DropdownButton )[ 0 ];

				firstToggle.props.onSelect( {}, "hostOne" );

				onReleaseStub.should.be.calledOnce.and.calledWith( {
					name: "hostOne",
					data: [
						{ field: "project", op: "change", value: "projectOne" },
						{ field: "owner", op: "change", value: "ownerOne" },
						{ field: "branch", op: "change", value: "branchOne" },
						{ field: "version", op: "change", value: "1b1" }
					]
				} );
			} );
		} );
	} );
} );
