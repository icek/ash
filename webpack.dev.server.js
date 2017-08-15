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

const Express = require( 'express' );
const webpack = require( 'webpack' );
const devMiddleware = require( 'webpack-dev-middleware' );
const hotMiddleware = require( 'webpack-hot-middleware' );
const config = require( './webpack.config.examples' );

const compiler = webpack( config );

const HOST = process.env.HOST || 'localhost';
const PORT = +process.env.DEV_PORT || 3000;

const serverOptions = {
    contentBase: `http://${HOST}:${PORT}`,
    publicPath: config.length === 1 ? `/${config[0].name}` : '/',
    hot: true,
    inline: true,
    lazy: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true }
};

new Express()
    .use( devMiddleware( compiler, serverOptions ) )
    .use( hotMiddleware( compiler ) )

    .listen( PORT, HOST, err => {
        if( err ) return console.error( err );
        console.log( `Webpack development server listening on port ${PORT}` );
    } );
