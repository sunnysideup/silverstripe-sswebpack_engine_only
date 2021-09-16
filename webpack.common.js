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

/*
 * Report details to console
 */
const REPLACE = THEME_DIR + '/'
console.log('--------------------------------')
console.log('CONFIG (* = required) ')
console.log('with current setting and example:')
console.log('--------------------------------')
console.log('FROM (*):      ' + THEME_DIR_CONFIG.replace(path.resolve(ROOT_DIR_CONFIG), './'))
console.log('               --theme_dir=themes/mytheme # NB this dir should contain a src folder')
console.log('               --theme_dir=vendor/vendor-name/package-name/client # NB this dir should contain a src folder')
console.log('')
console.log('--------------------------------')
console.log('RESULTING (THEME OR VENDOR PACKAGE) CLIENT DIR')
console.log('--------------------------------')
console.log('' + REPLACE)
console.log('')
console.log('--------------------------------')
console.log('js_file:       ' + JS_FILE.replace(REPLACE, './'))
console.log('               --js_file=' + JS_FILE_CONFIG)
console.log('')
console.log('css_file:      ' + CSS_FILE.replace(REPLACE, './'))
console.log('               --css_file=' + CSS_FILE_CONFIG)
console.log('')
console.log('--------------------------------')
console.log('node_dir:      ' + NODE_DIR.replace(REPLACE, './'))
console.log('               --node_dir=' + NODE_DIR_CONFIG)
console.log('')
console.log('custom:        ' + WEBPACK_CUSTOM_ADD_PATH_DESC.replace(REPLACE, ''))
console.log('               --add=foo/bar/webpack-custom.js')
console.log('')
console.log('--------------------------------')
console.log('dist_dir:      ' + DIST_DIR.replace(REPLACE, './'))
console.log('               --dist_dir=' + DIST_DIR_CONFIG)
console.log('')
console.log('img_dir        ' + IMG_DIR.replace(REPLACE, './'))
console.log('               --img_dir=' + IMG_DIR_CONFIG)
console.log('')
console.log('fonts_dir      ' + FONTS_DIR.replace(REPLACE, './'))
console.log('               --fonts_dir=' + FONTS_DIR_CONFIG)
console.log('')
console.log('--------------------------------')
console.log('EXAMPLES')
console.log('--------------------------------')
console.log('npm run dev    --themes_dir=themes/mytheme/client --js_file=myfile.js')
console.log('npm run watch  --themes_dir=themes/mytheme/client --css_file=myfile.scss')
console.log('npm run build  --themes_dir=themes/mytheme/client --fonts_dir=fontsies')
console.log('--------------------------------')

/*
 * Load custom webpack config by command line params
 */
let customConfig = {}
if (WEBPACK_CUSTOM_ADD_PATH_CONFIG) {
  customConfig = require(WEBPACK_CUSTOM_ADD_PATH)
}

const myConfig = merge({
  // webpack cache system
  cache: {
    type: 'filesystem'
  },
  entry: {
    app: [
      JS_FILE,
      CSS_FILE
    ]
  },
  stats: {
    children: false,
    warnings: false
  },
  output: {
    filename: '[name].js',
    path: path.resolve(DIST_DIR)
  },
  module: {
    rules: [
      {
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
            ], // Preset used for env setup
            plugins: [
              ['@babel/transform-react-jsx']
            ],
            cacheDirectory: true,
            cacheCompression: true
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [{
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
              sourceMap: true,
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|webp|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'img-optimize-loader',
          options: {
            name: '[name].[ext]',
            outputPath: IMG_DIR_CONFIG,
            compress: {
              // This will take more time and get smaller images.
              mode: 'low', // 'lossless', 'high', 'low'
              disableOnDevelopment: true,
              // convert to webp
              webp: false,
              // loseless compression for png
              optipng: {
                optimizationLevel: 4
              },
              // lossy compression for png. This will generate smaller file than optipng.
              pngquant: {
                quality: [0.2, 0.8]
              },
              // Compression for svg.
              svgo: true,
              // Compression for gif.
              gifsicle: {
                optimizationLevel: 3
              },
              // Compression for jpg.
              mozjpeg: {
                progressive: true,
                quality: 60
              }
            },
            inline: {
              limit: 1
            }
          }
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: FONTS_DIR_CONFIG,
            name: '[name].[ext]'
          }
        }]
      }
    ]
  },

  // extra settings
  resolve: {

    // defines root folders for compatibility
    roots: [
      path.resolve('./../../'),
      path.resolve('./../../public')
    ],

    // //node modules to include
    modules: [
      path.join(__dirname, 'node_modules'),
      path.resolve(NODE_DIR)
    ],

    // aliases
    alias: {
      'window.jQuery': require.resolve('jquery'),
      $: require.resolve('jquery'),
      jQuery: require.resolve('jquery'),

      // react: require.resolve('react'),
      // 'react-dom': require.resolve('react-dom'),

      site: path.resolve('./../../'),
      PROJECT_ROOT_DIR: path.resolve('./../../')
    },

    fallback: {
      path: false
    }
  }

  // in case you load it from CDN
  /* externals: {
                  jquery: 'jQuery',
                  react: 'React',
                  'react-dom': 'ReactDOM',
              }, */
},
customConfig
)

module.exports = myConfig
