// Setup for running Mocha via Node
require( "source-map-support" ).install();
const jsdom = require( "jsdom" ).jsdom;
global.document = jsdom( "<html><body></body></html>" );
global.window = document.parentWindow;
global.localStorage = { getItem: function() {}, setItem: function() {} }; // eslint-disable-line object-shorthand
global.BROWSER = false;

// For React (And its stupid console statement );
global.navigator = { userAgent: "Not Chrom3" };
