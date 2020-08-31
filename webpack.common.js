const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack')

const path = require('path')

const variables = require('./../webpack-variables.js')

const THEME_NAME = variables.themeName

module.exports = {
  entry: {
    app: [
      '../' + variables.themeName + '/src/main.js',
      '../' + variables.themeName + '/src/style.scss'
    ]

    // only turn on when you want to create the editor.css file!
    // editor: [
    //     '../'+variables.themeName+'/src/editor.scss'
    // ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(
      '../' + variables.themeName + '/dist/'
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
      path.resolve(`../${THEME_NAME}/node_modules`)
    ],

    // aliases
    alias: {
      site: path.resolve('./../../')
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
