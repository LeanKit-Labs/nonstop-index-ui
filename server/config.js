var path = require( "path" );
var fs = require( "fs" );
var os = require( "os" );
var machine = os.hostname();
var pid = process.pid;

var defaults = require( "../config.defaults.json" );

var opts = {
	prefix: "lk",
	defaults: defaults
};

var configPath = path.join( process.cwd(), "config.json" );
if ( fs.existsSync( configPath ) ) {
	opts.file = configPath;
}

var config = require( "configya" )( opts );
config.identity = [ machine, config.name, pid ].join( "." );
process.title = config.name;

module.exports = config;
