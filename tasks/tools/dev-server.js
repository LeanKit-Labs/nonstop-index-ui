require( "../shared/appConfig" );
var fount = require( "fount" );
var webpackConfig = require( "../webpack/dev.config.js" );
var compiler = require( "webpack" )( webpackConfig );

fount.register( "webpackCompiler", compiler );

require( "../../server/index.js" );
