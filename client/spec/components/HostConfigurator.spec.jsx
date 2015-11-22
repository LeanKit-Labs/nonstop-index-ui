import hostConfiguratorFactory from "inject!HostConfigurator";

describe( "HostConfigurator", () => {
	let actions, component, dependencies, optionsData;

	beforeEach( () => {
		actions = {
			configureHost: sinon.stub(),
			selectProject: sinon.stub(),
			selectOwner: sinon.stub(),
			selectBranch: sinon.stub(),
			selectVersion: sinon.stub(),
			selectHost: sinon.stub(),
			applySettings: sinon.stub()
		};

		lux.customActionCreator( actions );

		optionsData = {
			selectedProject: "projectA",
			selectedOwner: "ownerA",
			selectedBranch: "branchA",
			selectedVersion: "versionA",
			selectedHost: { name: "hostA" },
			projects: [ "projectA", "projectB" ],
			owners: [ "ownerA", "ownerB" ],
			branches: [ "branchA", "branchB" ],
			versions: [ "versionA", "versionB" ],
			hosts: [
				{ name: "hostOne" }
			]
		};

		dependencies = {
			OptionsDropdown: getMockReactComponent( "OptionsDropdown" ),
			"stores/configurationStore": {
				getOptions: sinon.stub().returns( optionsData ),
				getApplyEnabled: sinon.stub().returns( true )
			}
		};

		const HostConfigurator = hostConfiguratorFactory( dependencies );

		component = ReactUtils.renderIntoDocument( <HostConfigurator /> );
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
				selectedProject: "projectA",
				selectedOwner: "ownerA",
				selectedBranch: "branchA",
				selectedVersion: "versionA",
				selectedHost: {
					name: "hostA"
				},
				projects: [
					"projectA",
					"projectB"
				],
				owners: [
					"ownerA",
					"ownerB"
				],
				branches: [
					"branchA",
					"branchB"
				],
				versions: [
					"versionA",
					"versionB"
				],
				hosts: [
					{ name: "hostOne" }
				],
				applyEnabled: true
			} );
		} );
	} );

	describe( "when rendering", () => {
		let dropdowns;

		beforeEach( () => {
			dropdowns = _.indexBy( ReactUtils.scryRenderedComponentsWithType( component, dependencies.OptionsDropdown ), "props.name" );
		} );

		[ "host", "project", "owner", "branch", "version" ].forEach( field => {
			describe( `Dropdown for ${ field }`, () => {
				it( "should display the dropdown toggle", () => {
					const dropdown = dropdowns[ field ];
					const selected = optionsData[ `selected${ _.capitalize( field ) }` ];
					const optionsField = `${ field }${ field !== "branch" ? "s" : "es" }`;
					const options = optionsData[ optionsField ];
					const onSelect = component[ `select${ _.capitalize( field ) }` ];

					dropdown.props.should.eql( {
						name: field,
						selected,
						options,
						onSelect
					} );
				} );
			} );
		} );
	} );

	describe( "when handling store changes", () => {
		[ "configuration", "project" ].forEach( ( namespace ) => {
			it( `should update on changes to the ${ namespace } store`, () => {
				dependencies[ "stores/configurationStore" ].getApplyEnabled.returns( false );
				postal.channel( "lux.store" ).publish( `${ namespace }.changed` );

				component.state.applyEnabled.should.be.false;
			} );
		} );
	} );

	describe( "applying settings", () => {
		let applyButton;

		beforeEach( () => {
			const footer = ReactUtils.findRenderedDOMComponentWithClass( component, "box-footer" );
			applyButton = footer.querySelector( "button" );
		} );

		it( "should be enabled when applyEnabled is true", () => {
			applyButton.disabled.should.be.false;
		} );

		it( "should not be enabled when applyEnabled is false", () => {
			component.state.applyEnabled = false;
			component.forceUpdate();

			applyButton.disabled.should.be.true;
		} );

		it( "should call the applySettings actions on click", () => {
			ReactUtils.Simulate.click( applyButton );

			// should specifically not pass settings as first arg
			actions.applySettings.should.be.calledOnce.and.calledWith( null );
		} );
	} );
} );
