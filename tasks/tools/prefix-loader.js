const _ = require( "lodash" );
const qs = require( "querystring" );

function buildRegex( templates, prefix ) {
	return templates.map( template => {
		const patt = template.replace( "$PREFIX$", prefix );
		return new RegExp( patt, "gm" );
	} );
}

const defaultOptions = {
	patterns: [
		"(React.DOM.img\\((?:.|[\\n\\r])*src:\\s*['\"](?!$PREFIX$))(\\/.*)(['\"])",
		"(<img.*src=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
		"(<link.*href=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
		"(<script.*src=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
		"(url.*\\(.*['\"](?!$PREFIX$))(\\/.*)(['\"]\\))"
	]
};

module.exports = function( input ) {
	this.cacheable();

	const query = this.query ? qs.parse( this.query.substr( 1 ) ) : {};
	const options = _.extend( {}, defaultOptions, this.options.prefixer, query );

	if ( options.prefix ) {
		const builtPatterns = buildRegex( options.patterns, options.prefix );

		builtPatterns.forEach( pattern => {
			input = input.replace( pattern, `$1${options.prefix}$2$3` );
		} );
	} else {
		console.warn( "You need to specify a prefix in your prefix loader" ); // eslint-disable-line no-console
	}
	return input;
};
