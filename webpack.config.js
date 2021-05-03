/* npm packages to help to work with file and directory paths */
// const glob = require('glob-all')
// const path = require('path')

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
/* optimises JS */
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

/* optimises Images */
// const imageminWebpackPlugin = require('imagemin-webpack-plugin').default
// const imageminOptipng = require('imagemin-optipng')
// const imageminGifsicle = require('imagemin-gifsicle')
// const imageminJpegtran = require('imagemin-jpegtran')
// const imageminSvgo = require('imagemin-svgo')

/* shared modules between dev and production config */
const common = require('./webpack.common.js')

/* merges shared modules */
const { merge } = require('webpack-merge');

/* run composer vendor-expose after webpack build */
const WebpackHookPlugin = require('webpack-hook-plugin');
// see: https://github.com/johnagan/clean-webpack-plugin
// do not use this as it will delete images...
// const CleanWebpackPlugin = require('clean-webpack-plugin')

/* templates directory */
// const templateBaseDirName = __dirname + '/templates/';

/* all ss templates */
// let Files = glob.sync([templateBaseDirName + "**/*.ss"]);
const path = require('path')
const ROOT_DIR_CONFIG = process.env.npm_config_root_dir || '../..'
const THEME_DIR_CONFIG = process.env.npm_config_theme_dir || 'themes/error-use-theme_dir-parameter-to-set-target-folder'
const THEME_DIR = path.resolve(ROOT_DIR_CONFIG + '/' + THEME_DIR_CONFIG)

const conf = merge(
    common, {
        entry: {
            editor: [
                THEME_DIR + '/src/editor.scss'
            ]
        },
        mode: 'production',
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: () => {
                    return 'vendors~app';
                }
            },
            minimizer: [
                //new OptimizeCSSAssetsPlugin({}),
                new TerserPlugin({
                    terserOptions: {
                        module: false,
                        parse: {
                            // we want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minfication steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                        },
                        keep_fnames: true,
                        keep_classnames: true,

                        mangle: {
                            safari10: true,
                            keep_fnames: true,
                            keep_classnames: true,
                            reserved: ['$', 'jQuery', 'jquery'],
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                    // Use multi-process parallel running to improve the build speed
                    // Default number of concurrent runs: os.cpus().length - 1
                    parallel: true,
                }),
                new CssMinimizerPlugin({
                    parallel: true,
                    minimizerOptions: [{
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                                zindex: true,
                                cssDeclarationSorter: true,
                                reduceIdents: false,
                                mergeIdents: true,
                                mergeRules: true,
                                mergeLonghand: true,
                                discardUnused: true,
                                discardOverridden: true,
                                discardDuplicates: true,
                            },
                        ],
                    }, ],
                    minify: [
                        CssMinimizerPlugin.cssnanoMinify,
                        //CssMinimizerPlugin.cleanCssMinify,
                    ]
                }),
            ]
        },
        plugins: [
            // new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new WebpackHookPlugin({
                onBuildStart: ['echo "Starting..."'],
                // onBuildExit:['cd ../.. && composer vendor-expose'],
                safe: true
            }),
            // new BundleAnalyzerPlugin({ analyzerPort: 'auto' })
        ]
    }
)

module.exports = conf;
