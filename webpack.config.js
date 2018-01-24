/* global __dirname process */

const webpack                 = require( 'webpack' );
const ExtractTextPlugin       = require( 'extract-text-webpack-plugin' );
const autoprefixer            = require( 'autoprefixer' );
const autoprefixerBrowsers    = [ '> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1' ];
const path                    = require( 'path' ); // This resolves into the absolute path of the theme root.
const env                     = process.env.NODE_ENV;

let config = {
    entry: {
        main: __dirname + '/assets/js/app.js'
    },
    output: {
        path: __dirname + '/assets/dist',
        filename: '[name].js'
    },
    externals: {
        'jquery': 'jQuery',
        'acf': 'acf'
    },
    postcss: function() {

        // Enable autoprefixing.
        return [ autoprefixer({ browsers: autoprefixerBrowsers }) ];
    },
    plugins: [

        // Extract all css into one file.
        new ExtractTextPlugin( '[name].css', {
            allChunks: true
        }),

        // Provide jQuery instance for all modules.
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            acf: 'acf'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',

                // List paths to packages using ES6 to enable Babel compiling.
                include: [
                    path.resolve( __dirname, 'assets/js' )
                ],
                query: {

                    // Do not use the .babelrc configuration file.
                    babelrc: false,

                    // The loader will cache the results of the loader in node_modules/.cache/babel-loader.
                    cacheDirectory: true,

                    // The 'transform-runtime' plugin tells babel to require the runtime instead of inlining it.
                    plugins: [ 'transform-runtime' ],

                    // List enabled ECMAScript feature sets.
                    presets: [ 'es2016', 'es2015', 'stage-0' ]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract( 'style', 'css' )
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract( 'style-loader', 'css!postcss!sass' )
            }
        ]
    },
    watchOptions: {
        poll: 500
    }
};

if ( env === 'production' ) {
    config.plugins.push(

        // Minify for the production environment.
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            compress: {
                unused: false
            }
        })
    );
}

module.exports = config;
