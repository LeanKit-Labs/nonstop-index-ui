var _ = require( "lodash" );
var qs = require( "querystring" );

function buildRegex( templates, prefix ) {
	return templates.map( function( template ) {
		var patt = template.replace( "$PREFIX$", prefix );
		return new RegExp( patt, "gm" );
	} );
}

var defaultOptions = {
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

	var query = this.query ? qs.parse( this.query.substr( 1 ) ) : {};
	var options = _.extend( {}, defaultOptions, this.options.prefixer, query );

	if ( options.prefix ) {
		var builtPatterns = buildRegex( options.patterns, options.prefix );

		builtPatterns.forEach( function( pattern ) {
			input = input.replace(
				pattern,
				"$1" + options.prefix + "$2$3"
			);
		} );
	} else {
		console.warn( "You need to specify a prefix in your prefix loader" );
	}
	return input;
};
