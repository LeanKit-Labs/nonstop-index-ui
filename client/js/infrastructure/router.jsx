import Router,{ Route } from "react-router";
import App from "App";
import Dashboard from "Dashboard";
import ProjectDetail from "ProjectDetail";
import HostList from "HostList";
import HostConfigurator from "HostConfigurator";
import luxLocationFactory from "infrastructure/luxLocationFactory";
import navigationStore from "stores/navigationStore";
import React from "react"; //eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import config from "../clientConfig";

var routes = (
	<Route path={ config.urlPrefix + "/" } handler={ App }>
		<Route path="project/:name/:owner/:branch" handler={ ProjectDetail } />
		<Route path="host" handler={ HostList } />
		<Route path="host/configure" handler={ HostConfigurator } />
		<Route path="" handler={ Dashboard } />
	</Route>
);

const router = Router.create( {
	routes: routes,
	location: luxLocationFactory( navigationStore )
} );

router.run( ( Handler, state ) => ReactDOM.render( <Handler { ...state } />, document.querySelector( ".app-root" ) ) );

export default router;
