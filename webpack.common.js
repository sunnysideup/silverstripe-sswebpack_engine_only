const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* deletes dist folder before new bundles are created */
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const variables = require('./../webpack-variables.js');

const THEME_NAME = variables.themeName;

module.exports = {
    entry: {
        app: [
            '../'+variables.themeName+'_app/src/main.js',
            '../'+variables.themeName+'_app/src/style.scss'
        ],
        editor: [
            '../'+variables.themeName+'_app/src/editor.scss'
        ],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../", variables.distributionFolder),
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
                                require('autoprefixer')({'browsers': ['> 1%', 'last 2 versions']}),
                            ]
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
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
                    loader: 'babel-loader',
                    options: {
                        // presets: ['stage-0']
                    }
                }
            },
            // {
            //     test: /\.svg$/i,
            //     use: 'svg-inline-loader'
            // },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                    }
                }]
            }
        ]
    },


    //extra settings
    resolve: {

        // //node modules to include
        modules: [
            path.join(__dirname, "node_modules"),
            path.resolve(`../${THEME_NAME}_node_modules/node_modules`),
            path.resolve(`../${THEME_NAME}_app/node_modules/`)
        ],

        //aliases
        alias: {
            site: path.resolve(`./../../`),
        },
        // extensions: [".js", ".jsx"]
    },

    plugins:[
        new CleanWebpackPlugin(
            [path.resolve(variables.absolutePath, variables.distributionFolder)],
            {
                  root: path.resolve(variables.absolutePath),
                  verbose: true,
                  dry: false
            }
        ),
        new webpack.ProvidePlugin(
            {
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }
        )
    ]
}
