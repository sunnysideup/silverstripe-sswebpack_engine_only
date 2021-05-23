const webpack = require('webpack')

const path = require('path')

const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* merge shared modules */

const ROOT_DIR_CONFIG = process.env.npm_config_root_dir || '../..'
const THEME_DIR_CONFIG = process.env.npm_config_theme_dir || 'themes/error-use-theme_dir-parameter-to-set-target-folder'
const NODE_DIR_CONFIG = process.env.npm_config_node_dir || THEME_DIR_CONFIG + '/my_node_modules'
const JS_FILE_CONFIG = process.env.npm_config_js_file || 'src/main.js'
const CSS_FILE_CONFIG = process.env.npm_config_css_file || 'src/style.scss'
const DIST_DIR_CONFIG = process.env.npm_config_dist_dir || THEME_DIR_CONFIG + '/dist'
const IMG_DIR_CONFIG = process.env.npm_config_img_dir || 'images'
const FONTS_DIR_CONFIG = process.env.npm_config_fonts_dir || 'fonts'
const WEBPACK_CUSTOM_ADD_PATH_CONFIG = process.env.npm_config_add || ''

const THEME_DIR = path.resolve(ROOT_DIR_CONFIG + '/' + THEME_DIR_CONFIG)
const JS_FILE = path.resolve(THEME_DIR + '/' + JS_FILE_CONFIG)
const CSS_FILE = path.resolve(THEME_DIR + '/' + CSS_FILE_CONFIG)
const NODE_DIR = path.resolve(ROOT_DIR_CONFIG + '/' + NODE_DIR_CONFIG + '/node_modules')
const DIST_DIR = path.resolve(ROOT_DIR_CONFIG + '/' + DIST_DIR_CONFIG)
const IMG_DIR = path.resolve(DIST_DIR + '/' + IMG_DIR_CONFIG)
const FONTS_DIR = path.resolve(DIST_DIR + '/' + FONTS_DIR_CONFIG)
let WEBPACK_CUSTOM_ADD_PATH = ''
let WEBPACK_CUSTOM_ADD_PATH_DESC = '--not set--'
if (WEBPACK_CUSTOM_ADD_PATH_CONFIG) {
  WEBPACK_CUSTOM_ADD_PATH = path.resolve(ROOT_DIR_CONFIG + '/' + WEBPACK_CUSTOM_ADD_PATH_CONFIG)
  WEBPACK_CUSTOM_ADD_PATH_DESC = WEBPACK_CUSTOM_ADD_PATH
}

console.log('--------------------------------')
console.log('CONFIG (* = required)')
console.log('--------------------------------')
console.log('* FROM:      theme_dir: ' + THEME_DIR + ' e.g. ')
console.log('  --theme_dir=themes/mytheme (this dir should contain a src folder)')
console.log('  --theme_dir=vendor/vendor-name/package-name/client (this dir should contain a src folder)')

console.log('USING JS:    js_file:   ' + JS_FILE + ' set using --js_file=' + JS_FILE_CONFIG)
console.log('USING CSS:   css_file:  ' + CSS_FILE + ' set using --css_file=' + CSS_FILE_CONFIG)
console.log('--------------------------------')
console.log('USING NODE:  node_dir:  ' + NODE_DIR + ' set using --node_dir=' + NODE_DIR_CONFIG)
console.log('WEBPACK ADD: custom:    ' + WEBPACK_CUSTOM_ADD_PATH_DESC + ' set using --add=foo/bar/webpack-custom.js')
console.log('--------------------------------')
console.log('TO:          dist_dir:  ' + DIST_DIR + ' set using --dist_dir=' + DIST_DIR_CONFIG)
console.log('USING IMG:   img_dir:   ' + IMG_DIR + ' set using --img_dir=' + IMG_DIR_CONFIG)
console.log('USING FONTS: fonts_dir: ' + FONTS_DIR + ' set using --fonts_dir=' + FONTS_DIR_CONFIG)
console.log('--------------------------------')
console.log('EXAMPLES')
console.log('--------------------------------')
console.log('npm run dev   --themes_dir=themes/mytheme/client --js_file=myfile.js')
console.log('npm run watch --themes_dir=themes/mytheme/client --css_file=myfile.scss')
console.log('npm run build --themes_dir=themes/mytheme/client --fonts_dir=fontsies')
console.log('--------------------------------')

let customConfig = {}
if (WEBPACK_CUSTOM_ADD_PATH_CONFIG) {
  customConfig = require(WEBPACK_CUSTOM_ADD_PATH)
}

module.exports = merge(
  {
    entry: {
      app: [
        JS_FILE,
        CSS_FILE
      ]
    },
    output: {
      filename: '[name].js',
      path: path.resolve(
        DIST_DIR
      )
      // crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          // javascripts
          test: /\.jsx?$/,
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/react',
                {
                  plugins: [
                    '@babel/plugin-proposal-class-properties'
                  ]
                }
              ],
              plugins: [
                [
                  '@babel/transform-react-jsx'
                ]
              ],
              cacheDirectory: true,
              cacheCompression: true
            }
          }
        },
        // css
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer']
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        },
        // images
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 4096, // in bytes
            outputPath: IMG_DIR_CONFIG,
            name: '[name].[ext]'
          }
        },
        // fonts
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: FONTS_DIR_CONFIG,
                name: '[name].[ext]'
              }
            }
          ]
        },
        // add jQuery
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: {
                exposes: ['$', 'jQuery']
              }
            }
          ]
        }
        // {
        //     test: /\.svg$/i,
        //     use: 'svg-inline-loader'
        // },
      ]
    },

    // extra settings
    resolve: {

      // node modules to include
      modules: [
        path.join(__dirname, 'node_modules'),
        path.resolve(NODE_DIR)
      ],

        // aliases
      alias: {
        site: path.resolve('./../../'),
        PROJECT_ROOT_DIR: path.resolve('./../../')
      }
      // extensions: [".js", ".jsx"]
    },

    plugins: [
      // clean dist folder? Do not use as this will also delete all the images, etc...
      // new CleanWebpackPlugin(
      //     [path.resolve(variables.absolutePath, variables.distributionFolder)],
      //     {
      //           root: path.resolve(variables.absolutePath),
      //           verbose: true,
      //           dry: false
      //     }
      // ),
      new webpack.ProvidePlugin(
        {
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }
      )
    ]
  },
  customConfig
)
