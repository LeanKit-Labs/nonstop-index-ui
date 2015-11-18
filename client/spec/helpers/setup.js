require( "babel/polyfill" );
var chai = require( "chai" );

chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-string" ) );
chai.use( require( "chai-properties" ) );
chai.use( require( "chai-as-promised" ) );
global.should = chai.should();
global.when = require( "when" );
global._ = require( "lodash" );
global.sinon = require( "sinon" );
require( "sinon-as-promised" );
global.React = require( "react" );
global.ReactDOM = require( "react-dom" );
global.ReactUtils = require( "react-addons-test-utils" );
global.postal = require( "postal" );
global.lux = require( "lux.js" );

global.getMockReactComponent = function( name ) {
	return React.createClass( {
		render() {
			return <div className={ `component-${name.toLowerCase()}` }> { name } { this.props.children }</div>;
		}
	} );
};
