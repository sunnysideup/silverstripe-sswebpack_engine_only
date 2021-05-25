/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* optimises JS */
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

/* shared modules between dev and production config */
const common = require('./webpack.common.js')

/* merges shared modules */
const { merge } = require('webpack-merge')

const path = require('path')
const ROOT_DIR_CONFIG = process.env.npm_config_root_dir || '../..'
const THEME_DIR_CONFIG = process.env.npm_config_theme_dir || 'themes/error-use-theme_dir-parameter-to-set-target-folder'
const THEME_DIR = path.resolve(ROOT_DIR_CONFIG + '/' + THEME_DIR_CONFIG)

const conf = merge(
  common, {
    // get more debug details if you change to true
    stats: {
      children: false
    },
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
          return 'vendors~app'
        }
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            module: false,
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false
            },
            keep_fnames: true,
            keep_classnames: true,

            mangle: {
              safari10: true,
              keep_fnames: true,
              keep_classnames: true,
              reserved: ['$', 'jQuery', 'jquery']
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true
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
                discardDuplicates: true
              }
            ]
          }],
          minify: [
            CssMinimizerPlugin.cssnanoMinify
          ]
        })
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  }
)

module.exports = conf
