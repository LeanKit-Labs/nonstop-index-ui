/* eslint-disable */
const webpack = require( "webpack" );
/* eslint-enable */
const glob = require( "glob" );
const _ = require( "lodash" );
const path = require( "path" );

function aliasComponents() {
	const components = {};
	const matches = glob.sync( "./client/js/components/**/*.jsx" );
	matches.forEach( match => {
		const filename = path.basename( match, ".jsx" );
		components[ filename ] = path.join( appConfig.root, match );
	} );
	return components;
}

module.exports = {
	amd: { jQuery: true },
	module: {
		noParse: [
			/modernizr.*\.js/
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loader: "babel",
				include: path.join( appConfig.root, "./client" )
			},
			{ test: /\.css$/, loader: "style-loader!css-loader!autoprefixer-loader?{browsers:[\"last 2 version\", \"ie >= 9\"]}" },
			{ test: /\.less$/, loader: "style-loader!css-loader!autoprefixer-loader?{browsers:[\"last 2 version\", \"ie >= 9\"]}!less-loader" },
			{ test: /sinon.*\.js/, loader: "imports?define=>false" }
		]
	},
	resolve: {
		root: path.join( appConfig.root, "./client/js" ),
		extensions: [ "", ".webpack.js", ".web.js", ".js", ".jsx" ],
		alias: _.extend( {
			window: "infrastructure/windowProxy",
			"react-router": "react-router/umd/ReactRouter",
			modernizr: "lib/modernizr/modernizr.custom"
		}, aliasComponents()
		)
	}
};
