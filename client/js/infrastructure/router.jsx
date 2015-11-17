import Router,{ Route } from "react-router";
import App from "App";
import Dashboard from "Dashboard";
import ProjectDetail from "ProjectDetail";
import luxLocationFactory from "infrastructure/luxLocationFactory";
import navigationStore from "stores/navigationStore";
import React from "react";

var routes = (
	<Route path="/" handler={ App }>
		<Route path="/project/:name/:owner/:branch" handler={ ProjectDetail } />
		<Route path="/" handler={ Dashboard } />
	</Route>
);

const router = Router.create( {
	routes: routes,
	location: luxLocationFactory( navigationStore )
} );

router.run( ( Handler, state ) => React.render( <Handler { ...state } />, document.body ) );

export default router;
