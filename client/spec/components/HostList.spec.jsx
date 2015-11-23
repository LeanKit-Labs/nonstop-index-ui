import hostListFactory from "inject!HostList";

const HOSTS = require( "../data/hostsWithStatus" );

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
			createComponent( { hosts: [ HOSTS[0] ] } );
			const status = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList-status" ).textContent;
			status.should.include( "Last Updated: 12:00:00 AM" );
		} );

		it( "should render fields for a host", () => {
			const host = Object.assign( {}, HOSTS[0] );
			createComponent( { hosts: [ host ] } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const projectRow = hostList.querySelector( "tbody tr:nth-child(1)" ).textContent;
			projectRow.should.include( host.name );
			projectRow.should.include( host.ip );
			projectRow.should.include( host.project );
			const ownerRow = hostList.querySelector( "tbody tr:nth-child(2)" ).textContent;
			ownerRow.should.include( host.owner );
			const hostRow = hostList.querySelector( "tbody tr:nth-child(3)" ).textContent;
			hostRow.should.include( host.hostName );
		} );

		it( "should render get status button if status not available", () => {
			const host = Object.assign( {}, HOSTS[0] );
			delete host.status;
			createComponent( { hosts: [ host ] } );
			const button = ReactDOM.findDOMNode( component ).querySelector( "button" );
			button.textContent.should.equal( "Get Status" );
		} );

		it( "should render update status button if status available", () => {
			const host = Object.assign( {}, HOSTS[0] );
			createComponent( { hosts: [ host ] } );
			const button = ReactDOM.findDOMNode( component ).querySelector( "button" );
			button.textContent.should.equal( "Refresh Status" );
		} );

		it( "should render status if available", () => {
			const host = Object.assign( {}, HOSTS[0] );
			createComponent( { hosts: [ host ] } );
			let status = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList-status" ).textContent;
			status.should.include( host.status.hostUptime );
			status.should.include( host.status.serviceUptime );
			status.should.include( host.slug );
			status.should.include( host.version );
		} );

		it( "should be able to render one host", () => {
			const host = Object.assign( {}, HOSTS[0] );
			createComponent( { hosts: [ host ] } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const rowContent = hostList.querySelector( "tbody tr" ).textContent;
			rowContent.should.include( host.name );
			rowContent.should.include( host.ip );
			rowContent.should.include( host.project );
		} );

		it( "should be able to render multiple hosts", () => {
			const ROWS_PER_HOST = 4;
			createComponent( { hosts: HOSTS } );
			const hostList = ReactUtils.findRenderedDOMComponentWithClass( component, "hostList" );
			const rows = hostList.querySelectorAll( "tbody tr" );
			rows.length.should.equal( ROWS_PER_HOST * 2 );
		} );
	} );

	describe( "when handling clicks", () => {
		it( "should trigger the loadHostStatus action", () => {
			const host = Object.assign( {}, HOSTS[0] );
			delete host.status;
			createComponent( { hosts: [ host ] } );
			const button = ReactUtils.findRenderedDOMComponentWithClass( component, "btn" );
			ReactUtils.Simulate.click( button );
			lux.actions.loadHostStatus.should.be.calledOnce;
		} );
	} );
} );
