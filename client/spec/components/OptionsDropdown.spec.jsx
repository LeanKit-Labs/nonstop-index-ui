import optionsDropdownFactory from "inject!OptionsDropdown";

describe( "OptionsDropdown", () => {
	let component, components, dependencies, OptionsDropdown;

	beforeEach( () => {
		component = null;

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

		OptionsDropdown = wrapStatelessComponent( optionsDropdownFactory( dependencies ) );
	} );

	function render( options ) {
		component = ReactUtils.renderIntoDocument( <OptionsDropdown { ...options } /> );
	}

	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when rendering", () => {
		describe( "when values are strings", () => {
			let props;

			beforeEach( () => {
				props = {
					name: "test",
					selected: "one",
					options: [ "one", "two" ],
					onSelect: sinon.stub()
				};
			} );

			it( "should render a label", () => {
				render( props );

				const label = ReactUtils.findRenderedDOMComponentWithTag( component, "label" );
				label.htmlFor.should.equal( "testDropdown" );
				label.textContent.should.equal( "Test" );
			} );

			it( "should render the toggle", () => {
				render( props );

				const toggle = ReactUtils.findRenderedComponentWithType( component, components.Dropdown.Toggle );
				ReactDOM.findDOMNode( toggle ).textContent.should.contain( "one" );
			} );

			it( "should set props on toggle correctly when there is only one option", () => {
				props.options = [ "one" ];
				render( props );

				const toggle = ReactUtils.findRenderedComponentWithType( component, components.Dropdown.Toggle );
				toggle.props.disabled.should.be.true;
				toggle.props.noCaret.should.be.true;
			} );

			it( "should set props on toggle correctly when there is more than one option", () => {
				render( props );

				const toggle = ReactUtils.findRenderedComponentWithType( component, components.Dropdown.Toggle );
				toggle.props.disabled.should.be.false;
				toggle.props.noCaret.should.be.false;
			} );

			it( "should render the menu items", () => {
				render( props );

				const menuItems = ReactUtils.scryRenderedComponentsWithType( component, components.MenuItem );
				menuItems.should.have.lengthOf( props.options.length );

				_.each( menuItems, ( menuItem, index ) => {
					const option = props.options[ index ];
					const nodeText = ReactDOM.findDOMNode( menuItem ).textContent;
					nodeText.should.contain( props.options[ index ] );

					// ensure that onSelect function is properly bound to pass option
					menuItem.props.onSelect();
					props.onSelect.should.be.calledOnce.and.calledWith( option );
					props.onSelect.reset();
				} );
			} );
		} );

		describe( "when values are objects", () => {
			let props;

			beforeEach( () => {
				props = {
					name: "test",
					selected: { name: "one" },
					options: [
						{ name: "one" },
						{ name: "two" }
					],
					onSelect: sinon.stub()
				};

				render( props );
			} );

			it( "should render the toggle", () => {
				const toggle = ReactUtils.findRenderedComponentWithType( component, components.Dropdown.Toggle );
				ReactDOM.findDOMNode( toggle ).textContent.should.contain( "one" );
			} );

			it( "should render the menu items", () => {
				const menuItems = ReactUtils.scryRenderedComponentsWithType( component, components.MenuItem );
				const menuItemsText = menuItems.map( item => ReactDOM.findDOMNode( item ).textContent );

				menuItemsText.should.have.lengthOf( props.options.length );

				_.each( menuItemsText, ( menuItem, index ) => {
					menuItem.should.contain( props.options[ index ].name );
				} );
			} );
		} );
	} );
} );
