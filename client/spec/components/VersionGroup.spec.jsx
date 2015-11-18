import versionGroupFactory from "inject!VersionGroup";

describe( "VersionGroup", () => {
	let component, dependencies, VersionGroup;

	beforeEach( () => {
		dependencies = {};
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
				className: ""
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
			let rows;

			beforeEach( () => {
				createComponent( {
					versions: {
						1: {
							builds: {
								b1: { packages: [
									{ file: "p01", architecture: "x86", platform: "darwin", slug: "123", owner: "owner", project: "project" },
									{ file: "p02", architecture: "x64", platform: "linux", slug: "234", owner: "owner", project: "project" }
								] },
								b2: { packages: [
									{ file: "p03", architecture: "x128", platform: "amd", slug: "123", owner: "owner", project: "project" }
								] }
							}
						}
					}
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
				link.href.should.equal( "https://github.com/owner/project/commit/123" );
				link.textContent.trim().should.equal( "123" );
			} );
		} );
	} );
} );
