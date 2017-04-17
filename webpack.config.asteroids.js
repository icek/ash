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
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const HtmlWebpackHarddiskPlugin = require( 'html-webpack-harddisk-plugin' );
const config = require( './webpack.config.base' );


const host = process.env.HOST || 'localhost';
const port = +process.env.DEV_PORT || 3000;


config.entry.asteroids = [
    path.resolve( __dirname, 'src/examples/asteroids' ),
    `webpack-hot-middleware/client?reload=true&path=http://${host}:${port}/__webpack_hmr`
];
config.devtool = 'inline-source-map';
config.plugins.push(
    new webpack.DefinePlugin( { 'process.env.NODE_ENV': '"development"' } ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new HtmlWebpackPlugin( {
        alwaysWriteToDisk: true,
        filename: 'index.html',
        title: 'Asteroids',
        template: path.resolve( __dirname, 'src/examples/asteroids/index.ejs' )
    } )
);

config.output.publicPath = 'http://' + host + ':' + port + '/dist/';

module.exports = config;
