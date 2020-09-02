const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack')

const path = require('path')
console.log('--------------------------------')
console.log('PROCESSING: ' + path.resolve('./../../') + '/' + process.env.npm_config_theme_dir)
console.log('--------------------------------')

var THEME_DIR = process.env.npm_config_theme_dir || 'use-theme_dir-parameter-to-set-target-folder'
THEME_DIR = '../../' + THEME_DIR

module.exports = {
  entry: {
    app: [
      THEME_DIR + '/src/main.js',
      THEME_DIR + '/src/style.scss'
    ]

    // only turn on when you want to create the editor.css file!
    // editor: [
    //     '../'+variables.themeName+'/src/editor.scss'
    // ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(
      THEME_DIR + '/dist/'
    )
    // crossOriginLoading: 'anonymous'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('autoprefixer') // add prefixes for various browsers (e.g. webkit)
              ]
            }
          },
          {
            loader: 'resolve-url-loader'
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
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        },
        enforce: 'pre'
      },
      // {
      //     test: /\.svg$/i,
      //     use: 'svg-inline-loader'
      // },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }]
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      }
    ]
  },

  // extra settings
  resolve: {

    // //node modules to include
    modules: [
      path.join(__dirname, 'node_modules'),
      path.resolve(`${THEME_DIR}/my_node_modules`)
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
}
