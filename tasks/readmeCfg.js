const gulp = require( "gulp" );
const _ = require( "lodash" );
const fs = require( "fs" );
const path = require( "path" );
const opsTerms = [
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
	"NS_SESSION_REDIS_PREFIX",
	"NS__INDEX_URL"
];
const configDefaults = require( "../config.defaults.json" );

function insertMarkers( str ) {
	const caps = str.replace( /[^A-Z]/g, "" );
	if ( !caps ) {
		return str;
	}

	// insert _ marker prior to each capitalized letter
	_.each( caps, cp => {
		const pos = str.indexOf( cp );
		str = `${ str.substring( 0, pos ) }_${ str.substring( pos ) }`;
	} );

	return str;
}

function processConfigNode( keyBase, data, output, hasCamelCase ) {
	_.each( _.keys( data ), word => {
		const _word = insertMarkers( word );
		const _hasCamelCase = hasCamelCase || _word.indexOf( "_" ) > 0;

		const item = data[ word ];
		const key = keyBase.slice( 0 );
		key.push( _word );

		if ( _.isPlainObject( item ) ) {
			processConfigNode( key, item, output, _hasCamelCase );
		} else {
			const wordSeparator = _hasCamelCase ? "__" : "_";

			output.push( {
				section: key[ 1 ].replace( /_/g, "" ),
				constName: key.join( wordSeparator ).toUpperCase(),
				defaultValue: JSON.stringify( item )
			} );
		}
	} );
}

function generateEnvVarMarkdown( root ) {
	const items = [];
	processConfigNode( [ "NS" ], configDefaults, items );

	// convert to markdown
	let section = "";
	const buffer = _.map( items, item => {
		let line = "";
		const constName = opsTerms.indexOf( item.constName ) >= 0 ? `${ item.constName }\\*` : item.constName;
		if ( section !== item.section ) {
			section = item.section;
			line += `| **${ section }** | |\n`;
		}
		line += `| ${ constName } | \`${ item.defaultValue }\` |`;
		return line;
	} );
	return buffer.join( "\n" );
}

String.prototype.getSectionIndexes = function( header ) { // eslint-disable-line no-extend-native
	const template = `<!-- ${ header } -->\n`;
	const startIndex = this.indexOf( template ) + template.length;
	const stopIndex = this.indexOf( `<!-- /${ header }` );
	if ( startIndex < 0 || stopIndex < 0 || startIndex >= stopIndex ) {
		/* eslint-disable no-console */
		console.log( "Error: the target file does not contain a comment section with tags" );
		console.log( `        \`<!-- ${ header } -->\` and \`<!-- /${ header } -->\`` );
		/* eslint-enable no-console */
		return null;
	}
	return { start: startIndex, stop: stopIndex	};
};

gulp.task( "document-config", [], done => {
	const readme = path.resolve( __dirname, "../README.md" );
	fs.readFile( readme, { encoding: "utf8" }, ( err, md ) => {
		const index = md.getSectionIndexes( "EnvironmentVariables" );

		if ( !index ) {
			process.exit( 1 ); // eslint-disable-line no-process-exit
		}

		const header = "| Group / Variable | Default |\n|-------------|---------|\n";
		const generatedMD = `${ header}${ generateEnvVarMarkdown( "NS" ) }\n`;

		const update = md.substring( 0, index.start ) + generatedMD + md.substring( index.stop );
		fs.writeFile( readme, update, done );
	} );
} );
