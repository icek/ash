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

const webpack = require( 'webpack' );

const config = require( './webpack.config.base' );

config.devtool = 'none';

config.plugins.push(
    new webpack.DefinePlugin( { 'process.env.NODE_ENV': '"production"' } ),
    new webpack.LoaderOptionsPlugin( { minimize: true, debug: false } ),
    // new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin( {
        name: 'ash',
        filename: 'ash.js',
        minChunks: module => module.context && (module.context.indexOf( 'ash' ) !== -1)
    } ),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
            comments: false
        },
    } ),
    new DtsBundlePlugin( {
        name: 'ash.ts',
        main: 'dist/src/ash',
        baseDir: 'dist/src/ash',
        out: '../../ash.d.ts',
        removeSource: true,
        removeSourceDir: 'dist/src',
        outputAsModuleFolder: false // to use npm in-package typings
    } )
);

module.exports = config;

// https://medium.com/@vladimirtolstikov/how-to-merge-d-ts-typings-with-dts-bundle-and-webpack-e8903d699576#.bzfvru3ex
function DtsBundlePlugin( opts ) {
    this.opts = opts;
}
DtsBundlePlugin.prototype.apply = function( compiler ) {
    compiler.plugin( 'done', () => {
        let {opts} = this;
        require( 'dts-bundle' ).bundle( opts );
        if( opts.removeSource && opts.removeSourceDir ) require( 'rimraf' )( opts.removeSourceDir, () => {} );
    } );
};
