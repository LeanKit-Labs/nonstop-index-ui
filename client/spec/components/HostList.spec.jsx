import hostListFactory from "inject!HostList";

const HOST = require( "../data/hostWithStatus" );

describe( "HostList", () => {
	let component, dependencies, actions, HostList;

	beforeEach( () => {
		actions = {
			loadHostStatus: sinon.stub()
		};

		lux.customActionCreator( actions );

		dependencies = {};

		HostList = hostListFactory( dependencies );
	} );

	function createComponent( props = {} ) {
		component = ReactUtils.renderIntoDocument( <HostList {...props} /> );
	}

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	describe( "when handling props", () => {
		it( "should have default props", () => {
			createComponent();
			component.props.should.eql( {
				hosts: [],
				title: "Hosts"
			} );
		} );
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			createComponent();
			should.equal( component.state, null );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the hostList section", () => {
			createComponent();
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			should.exist( hostList );
		} );

		it( "should render last updated time", () => {
			createComponent( { hosts: [ HOST ] } );
			const status = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList-status" ).textContent;
			status.should.include( "Last Updated: 12:00:00 AM" );
		} );

		it( "should render fields for a host", () => {
			createComponent( { hosts: [ HOST ] } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const projectRow = hostList.querySelector( "tbody tr:nth-child(1)" ).textContent;
			projectRow.should.include( "name" );
			projectRow.should.include( "ip" );
			projectRow.should.include( "projectName" );
			const ownerRow = hostList.querySelector( "tbody tr:nth-child(2)" ).textContent;
			ownerRow.should.include( "owner" );
			const hostRow = hostList.querySelector( "tbody tr:nth-child(3)" ).textContent;
			hostRow.should.include( "hostName" );
		} );

		it( "should render get status button if status not available", () => {
			const host = Object.assign( {}, HOST );
			delete host.status;
			createComponent( { hosts: [ host ] } );
			const button = ReactDOM.findDOMNode( component ).querySelector( "button" );
			button.textContent.should.equal( "Get Status" );
		} );

		it( "should render update status button if status available", () => {
			const host = Object.assign( {}, HOST );
			createComponent( { hosts: [ host ] } );
			const button = ReactDOM.findDOMNode( component ).querySelector( "button" );
			button.textContent.should.equal( "Refresh Status" );
		} );

		it( "should render status if available", () => {
			createComponent( { hosts: [ HOST ] } );
			let status = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList-status" ).textContent;
			status.should.include( "hostUptime" );
			status.should.include( "serviceUptime" );
			status.should.include( "slug" );
			status.should.include( "version" );
		} );

		it( "should be able to render one host", () => {
			createComponent( { hosts: [ HOST ] } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const rowContent = hostList.querySelector( "tbody tr" ).textContent;
			rowContent.should.include( "name" );
			rowContent.should.include( "ip" );
			rowContent.should.include( "projectName" );
		} );

		it( "should be able to render multiple hosts", () => {
			const ROWS_PER_HOST = 4;
			createComponent( { hosts: [ HOST, HOST ] } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const rows = hostList.querySelectorAll( "tbody tr" );
			rows.length.should.equal( ROWS_PER_HOST * 2 );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the loadHostStatus action", () => {
			const host = Object.assign( {}, HOST );
			delete host.status;
			createComponent( { hosts: [ host ] } );
			const button = ReactUtils.findRenderedDOMComponentWithClass( component, "btn" );
			ReactUtils.Simulate.click( button );
			lux.actions.loadHostStatus.should.be.calledOnce;
		} );
	} );
} );
