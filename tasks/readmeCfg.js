var gulp = require( "gulp" );
var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
var opsTerms = [
	"NS_AUTH_GITHUB_ORGANIZATION",
	"NS__AUTH__GITHUB__CLIENT_ID",
	"NS__AUTH__GITHUB__CLIENT_SECRET",
	"NS__AUTH__GITHUB__CALLBACK_URL",
	"NS__HOST__PORT",
	"NS__LOGGING__ADAPTERS__STD_OUT__LEVEL",
	"NS_RABBIT_USER",
	"NS_RABBIT_PASS",
	"NS_RABBIT_HOST",
	"NS_RABBIT_PORT",
	"NS_RABBIT_VHOST",
	"NS_REDIS_HOST",
	"NS_REDIS_PORT",
	"NS_SESSION_REDIS_HOST",
	"NS_SESSION_REDIS_PORT",
	"NS_SESSION_REDIS_PREFIX"
];

function insertMarkers( str ) {
	var caps = str.replace( /[^A-Z]/g, "" );
	if ( !caps ) {
		return str;
	}

	// insert _ marker prior to each capitalized letter
	_.each( caps, function( cp ) {
		var pos = str.indexOf( cp );
		str = str.substring( 0, pos ) + "_" + str.substring( pos );
	} );

	return str;
}

function processConfigNode( keyBase, data, output, hasCamelCase ) {
	var item, _word, key, _hasCamelCase, wordSeparator;
	_.each( _.keys( data ), function( word ) {
		_word = insertMarkers( word );
		_hasCamelCase = hasCamelCase || _word.indexOf( "_" ) > 0;

		item = data[ word ];
		key = keyBase.slice( 0 );
		key.push( _word );

		if ( _.isPlainObject( item ) ) {
			processConfigNode( key, item, output, _hasCamelCase );
		} else {
			wordSeparator = _hasCamelCase ? "__" : "_";

			output.push( {
				section: key[ 1 ].replace( /_/g, "" ),
				varName: key.join( wordSeparator ).toUpperCase(),
				defaultValue: JSON.stringify( item )
			} );
		}
	} );
}

function generateEnvVarMarkdown( root ) {
	var items = [];
	processConfigNode( [ "NS" ], require( "../config.defaults.json" ), items );

	// convert to markdown
	var section = "";
	var buffer = _.map( items, function( item ) {
		var line = "";
		var varName = opsTerms.indexOf( item.varName ) >= 0 ? item.varName + "\\*" : item.varName;
		if ( section !== item.section ) {
			section = item.section;
			line += "| **" + section + "** | |\n";
		}
		line += "| " + varName + " | `" + item.defaultValue + "` |";
		return line;
	} );
	return buffer.join( "\n" );
}

String.prototype.getSectionIndexes = function( header ) {
	var template = "<!-- " + header + " -->\n";
	var startIndex = this.indexOf( template ) + template.length;
	var stopIndex = this.indexOf( "<!-- /" + header );
	if ( startIndex < 0 || stopIndex < 0 || startIndex >= stopIndex ) {
		console.log( "Error: the target file does not contain a comment section with tags" );
		console.log( "        `<!-- " + header + " -->` and `<!-- /" + header + " -->`" );
		return null;
	}
	return { start: startIndex, stop: stopIndex	};
};

gulp.task( "document-config", [], function( done ) {
	var readme = path.resolve( __dirname, "../README.md" );
	fs.readFile( readme, { encoding: "utf8" }, function( err, md ) {
		var index = md.getSectionIndexes( "EnvironmentVariables" );

		if ( !index ) {
			process.exit( 1 );
		}

		var header = "| Group / Variable | Default |\n|-------------|---------|\n";
		var generatedMD = header + generateEnvVarMarkdown( "NS" ) + "\n";

		var update = md.substring( 0, index.start ) + generatedMD + md.substring( index.stop );
		fs.writeFile( readme, update, function() {
			done();
		} );
	} );
} );
