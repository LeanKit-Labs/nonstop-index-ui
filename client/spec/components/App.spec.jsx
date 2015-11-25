import appFactory from "inject!App";

describe( "App Component", () => {
	let component, actions, dependencies, windowStub, container, App;

	beforeEach( () => {
		actions = {
			initializePage: sinon.stub(),
			handleAlertClose: sinon.stub()
		};

		lux.customActionCreator( actions );

		windowStub = {
			document: {}
		};

		dependencies = {
			window: windowStub,
			Toolbar: getMockReactComponent( "Toolbar" ),
			EnvironmentVariables: getMockReactComponent( "EnvironmentVariables" ),
			"react-bootstrap/lib/Alert": getMockReactComponent( "Alert" ),
			"react-router": {
				RouteHandler: React.createClass( {
					render: () => {
						return <div className="handledRoute"></div>;
					}
				} )
			},
			"stores/layoutStore": {
				getAlert: sinon.stub().returns( null )
			}
		};

		App = appFactory( dependencies );

		const props = {
			params: { id: "123" },
			query: { boardId: "456" }
		};

		container = document.createElement( "div" );
		component = ReactDOM.render( <App { ...props } />, container );
	} );

	afterEach( () => {
		delete lux.actions.initializePage;
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	it( "should render a Toolbar when initialized", () => {
		should.exist( ReactUtils.findRenderedComponentWithType( component, dependencies.Toolbar ) );
	} );

	it( "should render a route handler when initialized", () => {
		should.exist( ReactUtils.findRenderedDOMComponentWithClass( component, "handledRoute" ) );
	} );

	it( "should set the document title when mounted", () => {
		windowStub.document.title.should.equal( "Dashboard - Nonstop Index" );
	} );

	it( "should update the document title to reflect the current project", () => {
		ReactDOM.render( <App params={ { name: "core-blu" } } />, container );
		windowStub.document.title.should.equal( "core-blu - Nonstop Index" );
	} );

	it( "should render a loading indicator when not initialized", () => {
		component.setState( { initialized: false } );
		should.exist( ReactUtils.findRenderedDOMComponentWithClass( component, "spinner" ) );
	} );

	it( "should call initialize page on componentMount", () => {
		actions.initializePage.should.be.calledOnce.and.calledWith( {} );
	} );

	it( "should update on changes to the layout store", () => {
		dependencies[ "stores/layoutStore" ].getAlert.returns( {
			type: "success",
			message: "hello"
		} );

		postal.channel( "lux.store" ).publish( "layout.changed" );

		component.state.alert.should.eql( {
			type: "success",
			message: "hello"
		} );
	} );

	describe( "when displaying alerts", () => {
		let alert;

		beforeEach( () => {
			component.setState( {
				alert: {
					type: "success",
					message: "hello"
				}
			} );

			alert = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib/Alert" ] );
		} );

		it( "should display an alert when there is an alert in state", () => {
			alert.props.bsStyle.should.equal( "success" );

			const message = ReactUtils.findRenderedDOMComponentWithTag( alert, "p" );
			message.textContent.should.equal( "hello" );
		} );

		it( "should call the handleAlertClose action on dismissal of the Alert", () => {
			alert.props.onDismiss();

			actions.handleAlertClose.should.be.calledOnce;
		} );

		it( "should not display an alert when there is no alert in state", () => {
			component.setState( { alert: null } );
			const alerts = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib/Alert" ] );

			alerts.should.have.lengthOf( 0 );
		} );
	} );
} );
