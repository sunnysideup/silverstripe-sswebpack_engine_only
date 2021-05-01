/* npm packages to help to work with file and directory paths */

/*
 * reloads browser on file save(css/js)
 * To make livereload work with vagrant put this into your vagrant file
 * config.vm.network "forwarded_port", guest: 35729, host: 35729,  host_ip: "192.168.33.13"
 */
const LiveReloadPlugin = require('webpack-livereload-plugin')

/**
 * dash board
 */
const DashboardPlugin = require('webpack-dashboard/plugin')

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* merge shared modules */
const { merge } = require('webpack-merge');

/* shared modules between dev and production config */
const common = require('./webpack.common.js')

/* run composer vendor-expose after webpack build */
const WebpackHookPlugin = require('webpack-hook-plugin');

// const DISTRIBUTION_FOLDER = path.resolve(__dirname, "../", variables.distributionFolder);
/* deletes dist folder before new bundles are created */

module.exports = merge(
    common, {
        devtool: 'source-map',
        mode: 'development',
        watch: true,
        stats: 'errors-only',
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: [
            new DashboardPlugin(),
            new LiveReloadPlugin({
                protocol: 'http',
                hostname: 'localhost',
                appendScriptTag: true
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new WebpackHookPlugin({
                // onBuildExit: ['cd ../.. &&  composer vendor-expose'],
                safe: true
            })
        ]
        // devServer: {
        //     disableHostCheck: true,
        //     host: '0.0.0.0',
        //     hot: true,
        //     port: 3000,
        //     headers: {
        //         'Access-Control-Allow-Origin': '*'
        //     },
        // }

    }
)
