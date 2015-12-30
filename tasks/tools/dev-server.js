require( "babel/register" );
require( "../shared/appConfig" );
const fount = require( "fount" );
const webpackConfig = require( "../webpack/dev.config.js" );
const compiler = require( "webpack" )( webpackConfig );

fount.register( "webpackCompiler", compiler );

require( "../../server/index.js" );
