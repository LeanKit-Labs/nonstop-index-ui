import React from "react";
import $ from "jquery";
import when from "when";
import { handleRejection, handleException } from "infrastructure/errorHandler";
import api from "infrastructure/api";
import router from "infrastructure/router";
import projectStore from "stores/projectStore";
import navStore from "stores/navigationStore";

/* istanbul ignore next only used for development */
if ( DEBUG ) {
	// For dev tooling
	window.React = window.React || React;
	window.$ = $;
	window.router = router;
	window.api = api;
	window.navStore = navStore;
	window.projectStore = projectStore;
}

// errors when rendering reports are typically initiated as the result of an async request returning
when.Promise.onPotentiallyUnhandledRejection = handleRejection;

// normal unhandled errors (outside of promises)
window.onerror = handleException;
