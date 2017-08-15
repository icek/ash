/*
 *
 *        ______      __  ______          __
 *       / ____/___ _/ /_/ ____/___  ____/ /__
 *      / /_  / __ `/ __/ /   / __ \/ __  / _ \
 *     / __/ / /_/ / /_/ /___/ /_/ / /_/ /  __/
 *    /_/    \__,_/\__/\____/\____/\__,_/\___/
 *
 *  Copyright (c) 2017 FatCode Grzegorz Michlicki
 *
 */

const path = require( 'path' );
const webpack = require( 'webpack' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const DIST = 'dist';
const HOST = process.env.HOST || 'localhost';
let PORT = +process.env.DEV_PORT || 3000;
const getConfig = configName => {
    return {
        name: configName,
        entry: {
            [configName]: [
                path.resolve( __dirname, 'src', 'examples', configName ),
                `webpack-hot-middleware/client?name=${configName}&reload=true`
            ]
        },

        output: {
            // filesystem path for static files
            path: path.resolve( __dirname, DIST, configName ),

            // network path for static files
            publicPath: `http://${HOST}:${PORT}/${configName}/`,

            // file name pattern for entry scripts
            filename: '[name].js',

            // file name pattern for chunk scripts
            chunkFilename: '[name].js'
        },

        devtool: 'inline-source-map',
        resolve: {
            extensions: [ '.js', '.ts' ],
            alias: {
                ash: path.resolve( __dirname, 'src', 'ash' )
            }
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: '/node_modules/',
                    use: {
                        loader: 'ts-loader'
                    }
                },
            ]
        },

        plugins: [
            new CleanWebpackPlugin( `${DIST}/${configName}` ),
            new webpack.DefinePlugin( { 'process.env.NODE_ENV': '"development"' } ),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin( {
                filename: 'index.html',
                template: path.resolve( __dirname, 'src/examples', configName, 'index.ejs' )
            } )
        ]
    };
};

let asteroids = getConfig( 'asteroids' );
module.exports = [
    asteroids
];

