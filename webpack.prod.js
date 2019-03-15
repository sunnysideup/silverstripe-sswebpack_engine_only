/* npm packages to help to work with file and directory paths */
const glob = require('glob-all');
const path = require('path');

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/* optimises JS */
const TerserPlugin = require('terser-webpack-plugin');

/* optimises Images */
const {ImageminWebpackPlugin} = require("imagemin-webpack");
const imageminOptipng = require("imagemin-optipng");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminSvgo = require("imagemin-svgo");

/* removes unused css */
const PurifyCSSPlugin = require("purifycss-webpack");

/* shared modules between dev and production config */
const common = require('./webpack.common.js');

/* merges shared modules */
const merge = require('webpack-merge')


/* run composer vendor-expose after webpack build */
const WebpackShellPlugin = require('webpack-shell-plugin');

/* templates directory */
// const templateBaseDirName = __dirname + '/templates/';

/* all ss templates */
// let Files = glob.sync([templateBaseDirName + "**/*.ss"]);


const variables = require('./../webpack-variables.js');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: "[id].css"
            }),
        // new PurifyCSSPlugin({
        //     paths: (Files),
        //     purifyOptions: {
        //         minify: true,
        //         info: true,
        //         rejected: true,
        //         whitelist: ['*js*']
        //     }
        // }),
        new ImageminWebpackPlugin({
            imageminOptions: {
                plugins: [
                    imageminOptipng({
                        optimizationLevel: 5
                    }),
                    imageminGifsicle({
                        interlaced: true
                    }),
                    imageminJpegtran({
                        progressive: true
                    }),
                    imageminSvgo({
                        removeViewBox: true
                    })
                ]
            }
        }),
        new WebpackShellPlugin({
            onBuildStart: ['echo "Starting..."'],
            // onBuildExit:['cd ../.. && composer vendor-expose'],
            safe: true
        }),
    ],
})
