import Router,{ Route } from "react-router";
import App from "App";
import Dashboard from "Dashboard";
import luxLocationFactory from "infrastructure/luxLocationFactory";
import navStore from "stores/navigation";
import React from "react";

var Project = React.createClass( {
	render: function() {
		return <div>{ this.props.name }</div>;
	}
} );

var routes = (
	<Route path="/" handler={ App }>
		<Route path="/project/:name" handler={ Project } />
		<Route path="/" handler={ Dashboard } />
	</Route>
);

const router = Router.create( {
	routes: routes,
	location: luxLocationFactory( navStore )
} );

router.run( ( Handler, state ) => React.render( <Handler { ...state } />, document.body ) );

export default router;
