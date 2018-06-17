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
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );

const DIST = 'dist';

module.exports = {
    entry: {
        ash: [ path.resolve( __dirname, 'src/ash' ) ]
    },

    output: {
        library: 'ash.ts',

        libraryTarget: 'umd',

        // filesystem path for static files
        path: path.resolve( __dirname, DIST ),

        // network path for static files
        publicPath: '',

        // file name pattern for entry scripts
        filename: '[name].js',

        // file name pattern for chunk scripts
        chunkFilename: '[name].js'
    },

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
        new CleanWebpackPlugin( DIST )
    ]
};




