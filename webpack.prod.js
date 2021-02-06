/* npm packages to help to work with file and directory paths */
// const glob = require('glob-all')
// const path = require('path')

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
/* optimises JS */
const TerserPlugin = require('terser-webpack-plugin')

/* optimises Images */
// const imageminWebpackPlugin = require('imagemin-webpack-plugin').default
// const imageminOptipng = require('imagemin-optipng')
// const imageminGifsicle = require('imagemin-gifsicle')
// const imageminJpegtran = require('imagemin-jpegtran')
// const imageminSvgo = require('imagemin-svgo')

/* shared modules between dev and production config */
const common = require('./webpack.common.js')

/* merges shared modules */
const merge = require('webpack-merge')

/* run composer vendor-expose after webpack build */
const WebpackShellPlugin = require('webpack-shell-plugin')
// see: https://github.com/johnagan/clean-webpack-plugin
// do not use this as it will delete images...
// const CleanWebpackPlugin = require('clean-webpack-plugin')

/* templates directory */
// const templateBaseDirName = __dirname + '/templates/';

/* all ss templates */
// let Files = glob.sync([templateBaseDirName + "**/*.ss"]);

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin()
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
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
    // new imageminWebpackPlugin({
    //   plugins: [
    //     imageminOptipng({ optimizationLevel: 5 }),
    //     imageminGifsicle({ interlaced: true }),
    //     imageminJpegtran({ progressive: true }),
    //     imageminSvgo({ removeViewBox: true })
    //   ]
    // }),
    new WebpackShellPlugin({
      onBuildStart: ['echo "Starting..."'],
      // onBuildExit:['cd ../.. && composer vendor-expose'],
      safe: true
    })
    // new BundleAnalyzerPlugin({ analyzerPort: 'auto' })
  ]
})
