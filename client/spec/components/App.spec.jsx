import appFactory from "inject!App";

describe( "App Component", () => {
	let component, initializePageStub, dependencies, windowStub;

	beforeEach( () => {
		initializePageStub = sinon.stub();

		lux.customActionCreator( {
			initializePage: initializePageStub
		} );

		windowStub = {
			document: {}
		};

		dependencies = {
			window: windowStub,
			Toolbar: getMockReactComponent( "Toolbar" ),
			"react-router": {
				RouteHandler: React.createClass( {
					render: () => {
						return <div className="handledRoute"></div>;
					}
				} )
			},
			"stores/cardStore": {
				isInitialized: sinon.stub().returns( true )
			}
		};

		const App = appFactory( dependencies );

		const props = {
			params: { id: "123" },
			query: { boardId: "456" }
		};

		component = ReactUtils.renderIntoDocument( <App { ...props } /> );
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
		component.setProps( {
			params: { name: "core-blu" }
		} );
		windowStub.document.title.should.equal( "core-blu - Nonstop Index" );
	} );

	it( "should render a loading indicator when not initialized", () => {
		component.setState( { initialized: false } );
		should.exist( ReactUtils.findRenderedDOMComponentWithClass( component, "spinner" ) );
	} );

	it( "should call initialize page on componentMount", () => {
		initializePageStub.should.be.calledOnce.and.calledWith( {} );
	} );
} );
