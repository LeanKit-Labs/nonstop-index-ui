import projectDetailFactory from "inject!ProjectDetail";
import { noop } from "lodash";

describe( "ProjectDetail Component", () => {
	let component, dependencies, actions, ProjectDetail, container;

	beforeEach( () => {
		actions = {
			viewProject: sinon.stub(),
			finalizeDeploy: sinon.stub(),
			loadHostStatus: sinon.stub(),
			triggerDeploy: sinon.stub(),
			cancelDeploy: sinon.stub(),
			confirmReleasePackage: sinon.stub(),
			cancelReleasePackage: sinon.stub(),
			releasePackage: sinon.stub()
		};

		lux.customActionCreator( actions );

		const Modal = getMockReactComponent( "Modal" );
		Modal.Header = getMockReactComponent( "Modal.Header" );
		Modal.Title = getMockReactComponent( "Modal.Title" );
		Modal.Body = getMockReactComponent( "Modal.Body" );
		Modal.Footer = getMockReactComponent( "Modal.Footer" );

		dependencies = {
			"react-bootstrap/lib": {
				Modal,
				Button: getMockReactComponent( "Button" ),
				Table: React.createClass( {
					render() {
						return <table className="component-table"> table { this.props.children }</table>;
					}
				} )
			},
			HostList: getMockReactComponent( "HostList" ),
			ProjectDetailHeader: getMockReactComponent( "ProjectDetailHeader" ),
			VersionGroup: getMockReactComponent( "VersionGroup" ),
			"stores/projectStore": {
				getProject: sinon.stub().returns( {
					branches: [],
					owners: [],
					versions: {},
					hosts: []
				} ),
				getHosts: sinon.stub().returns( [] ),
				getDeployChoice: sinon.stub().returns( null ),
				getReleaseChoice: sinon.stub().returns( null )
			}
		};
		ProjectDetail = projectDetailFactory( dependencies );
		container = document.createElement( "div" );
	} );

	function createComponent( props = {} ) {
		if ( !props.params ) {
			props.params = { name: "project", owner: "owner", branch: "branch" };
		}
		props.onRelease = props.onRelease || noop;
		props.onDeploy = props.onDeploy || noop;
		component = ReactDOM.render( <ProjectDetail {...props} />, container );
	}

	afterEach( () => {
		Object.keys( actions ).forEach( key => delete lux.actions[ key ] );

		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
			component = null;
		}
	} );

	describe( "when handling state", () => {
		it( "should have initial state", () => {
			createComponent();
			component.state.should.eql( {
				branches: [],
				owners: [],
				hosts: [],
				versions: {},
				deployChoice: null,
				releaseChoice: null
			} );
		} );

		it( "should pass name, owner, and branch to store", () => {
			createComponent( {
				params: {
					name: "name",
					owner: "owner",
					branch: "branch"
				}
			} );
			dependencies[ "stores/projectStore" ].getProject.should.be.calledOnce
				.and.calledWith( "name", "owner", "branch" );
		} );

		describe( "when receiving new props", () => {
			beforeEach( () => {
				createComponent();
				dependencies[ "stores/projectStore" ].getProject.returns( {
					branches: [ "new-branch" ],
					owners: [],
					versions: {}
				} );
				ReactDOM.render(
					<ProjectDetail params={ { name: "new-project", owner: "new-owner", branch: "branch" } } />,
					container
				);
			} );

			it( "should update state when receiving new props", () => {
				component.state.branches.should.eql( [ "new-branch" ] );
			} );
		} );
	} );

	describe( "when handling store changes", () => {
		it( "should update state", () => {
			createComponent();
			dependencies[ "stores/projectStore" ].getProject.returns( {
				branches: [ "new-branch" ],
				owners: [],
				versions: {}
			} );
			postal.channel( "lux.store" ).publish( "project.changed" );
			component.state.branches.should.eql( [ "new-branch" ] );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render a ProjectDetailHeader", () => {
			createComponent();
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			should.exist( pdh );
		} );
		it( "should render a VersionGroup", () => {
			createComponent();
			const vg = ReactUtils.findRenderedComponentWithType( component, dependencies.VersionGroup );
			should.exist( vg );
			vg.props.hosts.should.equal( component.state.hosts );
		} );
		it( "should render a HostList", () => {
			createComponent();
			const hl = ReactUtils.findRenderedComponentWithType( component, dependencies.HostList );
			should.exist( hl );
			hl.props.noHostsMessage.should.equal( "No hosts are configured to run this project." );
		} );
		describe( "when a deploy is in progress", () => {
			describe( "and the host status is present", () => {
				beforeEach( () => {
					dependencies[ "stores/projectStore" ].getDeployChoice.returns( {
						error: "",
						pkg: {
							owner: "LeanKit-Labs",
							project: "same",
							branch: "master",
							version: "1.2.0-14"
						},
						host: {
							name: "project-host",
							owner: "BanditSoftware",
							project: "same",
							branch: "develop",
							version: "1.1.0-1",
							status: {}
						}
					} );
					createComponent();
				} );

				it( "should not show an error", () => {
					const callout = ReactUtils.scryRenderedDOMComponentsWithClass( component, "callout" );
					callout.should.be.empty;
				} );
				it( "should render the modal", () => {
					const modals = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal );
					ReactDOM.findDOMNode( modals[ 0 ] ).textContent.should.contain( "Confirm Deployment to" );
				} );
				it( "should render the host in the title", () => {
					const titles = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Title );
					ReactDOM.findDOMNode( titles[ 0 ] ).textContent.should.contain( "project-host" );
				} );
				it( "should show what changed", () => {
					const body = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Body );
					const table = ReactUtils.findRenderedDOMComponentWithClass( body, "table" );
					const rows = table.querySelectorAll( "tbody tr" );

					// Project
					rows[ 0 ].children[ 1 ].className.should.equal( "" );
					rows[ 0 ].children[ 1 ].textContent.should.equal( "same" );
					rows[ 0 ].children[ 2 ].className.should.equal( "" );
					rows[ 0 ].children[ 2 ].textContent.should.equal( "same" );

					// Owner
					rows[ 1 ].children[ 1 ].className.should.equal( "bg-danger" );
					rows[ 1 ].children[ 1 ].textContent.should.equal( "BanditSoftware" );
					rows[ 1 ].children[ 2 ].className.should.equal( "bg-success" );
					rows[ 1 ].children[ 2 ].textContent.should.equal( "LeanKit-Labs" );

					// Branch
					rows[ 2 ].children[ 1 ].className.should.equal( "bg-danger" );
					rows[ 2 ].children[ 1 ].textContent.should.equal( "develop" );
					rows[ 2 ].children[ 2 ].className.should.equal( "bg-success" );
					rows[ 2 ].children[ 2 ].textContent.should.equal( "master" );

					// Version
					rows[ 3 ].children[ 1 ].className.should.equal( "bg-danger" );
					rows[ 3 ].children[ 1 ].textContent.should.equal( "1.1.0-1" );
					rows[ 3 ].children[ 2 ].className.should.equal( "bg-success" );
					rows[ 3 ].children[ 2 ].textContent.should.equal( "1.2.0-14" );
				} );
				it( "should enable the deploy button", () => {
					const footer = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer )[ 0 ];
					const buttons = ReactUtils.scryRenderedComponentsWithType( footer, dependencies[ "react-bootstrap/lib" ].Button );
					buttons[ 1 ].props.disabled.should.be.false;
				} );
			} );
			describe( "and the host status is not yet present", () => {
				beforeEach( () => {
					dependencies[ "stores/projectStore" ].getDeployChoice.returns( {
						pkg: {
							owner: "LeanKit-Labs",
							project: "same",
							branch: "master",
							version: "1.2.0-14"
						},
						host: {
							name: "project-host",
							owner: "BanditSoftware",
							project: "same",
							branch: "develop",
							status: null
						}
					} );
					createComponent();
				} );
				it( "should not render the version if it is not present", () => {
					const body = ReactUtils.findRenderedComponentWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Body );
					const table = ReactUtils.findRenderedDOMComponentWithClass( body, "table" );
					const rows = table.querySelectorAll( "tbody tr" );

					// Version
					rows[ 3 ].children[ 1 ].textContent.should.equal( "..." );
				} );
				it( "should disable the deploy button", () => {
					const footer = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer )[ 0 ];
					const buttons = ReactUtils.scryRenderedComponentsWithType( footer, dependencies[ "react-bootstrap/lib" ].Button );
					buttons[ 1 ].props.disabled.should.be.true;
				} );
			} );

			describe( "and with an error", () => {
				beforeEach( () => {
					dependencies[ "stores/projectStore" ].getDeployChoice.returns( {
						error: "Mah error!",
						pkg: {},
						host: {}
					} );
					createComponent();
				} );
				it( "should show the error", () => {
					const callout = ReactUtils.findRenderedDOMComponentWithClass( component, "callout" );
					callout.textContent.trim().should.equal( "Mah error!" );
				} );
			} );
		} );
	} );

	describe( "when selecting a branch", () => {
		beforeEach( () => {
			const params = {
				name: "name",
				owner: "owner",
				branch: "branch"
			};
			createComponent( { params } );
		} );
		it( "should trigger viewProject with the same project and owner", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectBranch( "new-branch" );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "owner",
					branch: "new-branch"
				} );
		} );
	} );

	describe( "when canceling a deploy dialog", () => {
		beforeEach( () => {
			dependencies[ "stores/projectStore" ].getDeployChoice.returns( {
				error: "Mah error!",
				pkg: {},
				host: {}
			} );
			createComponent();
		} );

		it( "should cancel when its hidden", () => {
			const modal = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal )[ 0 ];
			modal.props.onHide();
			actions.cancelDeploy.should.be.calledOnce;
		} );
		it( "should cancel when cancel is clicked", () => {
			const footer = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer )[ 0 ];
			const buttons = ReactUtils.scryRenderedComponentsWithType( footer, dependencies[ "react-bootstrap/lib" ].Button );
			buttons[ 0 ].props.onClick();
			actions.cancelDeploy.should.be.calledOnce;
		} );
	} );

	describe( "when finalizing a deploy", () => {
		beforeEach( () => {
			dependencies[ "stores/projectStore" ].getDeployChoice.returns( {
				error: "Mah error!",
				pkg: {},
				host: {
					status: {}
				}
			} );
			createComponent();
		} );
		it( "should call finalizeDeploy when deploy is clicked", () => {
			const footer = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer )[ 0 ];
			const buttons = ReactUtils.scryRenderedComponentsWithType( footer, dependencies[ "react-bootstrap/lib" ].Button );
			buttons[ 1 ].props.onClick();
			actions.finalizeDeploy.should.be.calledOnce;
		} );
	} );

	describe( "when starting a deploy", () => {
		let vg;
		beforeEach( () => {
			createComponent();
			vg = ReactUtils.findRenderedComponentWithType( component, dependencies.VersionGroup );
		} );

		it( "should load hosts and call triggerDeploy", () => {
			vg.props.onDeploy( { pkg: {}, host: "mah-host" } );

			actions.loadHostStatus.should.be.calledOnce.and.calledWith( "mah-host" );
			actions.triggerDeploy.should.be.calledOnce.and.calledWith( { pkg: {}, host: "mah-host" } );
		} );
	} );

	describe( "when starting a release", () => {
		let vg;
		beforeEach( () => {
			createComponent();
			vg = ReactUtils.findRenderedComponentWithType( component, dependencies.VersionGroup );
		} );

		it( "should call confirmReleasePackage", () => {
			vg.props.onRelease( { pkg: {} } );
			actions.confirmReleasePackage.should.be.calledOnce.and.calledWith( { pkg: {} } );
		} );
	} );

	describe( "when confirming a release", () => {
		beforeEach( () => {
			dependencies[ "stores/projectStore" ].getReleaseChoice.returns( {
				architecture: "architecture-value",
				branch: "branch-value",
				osName: "osName-value",
				osVersion: "osVersion-value",
				owner: "owner-value",
				platform: "platform-value",
				project: "project-value",
				slug: "slug-value"
			} );
			createComponent();
		} );
		it( "should call releasePackage when release is clicked", () => {
			const footer = ReactUtils.scryRenderedComponentsWithType( component, dependencies[ "react-bootstrap/lib" ].Modal.Footer )[ 1 ];
			const buttons = ReactUtils.scryRenderedComponentsWithType( footer, dependencies[ "react-bootstrap/lib" ].Button );
			buttons[ 1 ].props.onClick();
			actions.releasePackage.should.be.calledOnce;
		} );
	} );

	describe( "when selecting an owner", () => {
		beforeEach( () => {
			const params = {
				name: "name",
				owner: "owner",
				branch: "branch"
			};
			createComponent( { params } );
		} );
		it( "should trigger viewProject with the same project and branch if available", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectOwner( { name: "new-owner", branches: [ "branch" ] } );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "new-owner",
					branch: "branch"
				} );
		} );
		it( "should trigger viewProject with the same project and first branch of the owner if the current branch is not present", () => {
			const pdh = ReactUtils.findRenderedComponentWithType( component, dependencies.ProjectDetailHeader );
			pdh.props.onSelectOwner( { name: "new-owner", branches: [ "other-branch", "the-branch" ] } );
			lux.actions.viewProject.should.be.calledOnce
				.and.calledWith( {
					name: "name",
					owner: "new-owner",
					branch: "other-branch"
				} );
		} );
	} );
} );
