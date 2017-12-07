/*
 Webpack Config!
 Original version: Andrew Haine // hello@andrewhaine.co.uk
*/




/*
    Imports
*/

import webpack from 'webpack';
import path from 'path';
import DashboardPlugin from 'webpack-dashboard/plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import variables from './../webpack-variables';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');



/*
    Useful constants
*/

const SITE_NAME = variables.devWebAddress;
const THEME_NAME = variables.themeName;
const DISTRIBUTION_FOLDER = variables.distributionFolder;



/*
    Plugin configuration
*/

//different css points
const extractEditor = new ExtractTextPlugin({
    filename: 'editor.css',
});
const extractMain = new ExtractTextPlugin({
    filename: 'style.css',
});



//define plugins
let plugins = [];

const IS_PROD = process.env.NODE_ENV === 'production';

if(IS_PROD) {
    plugins.push(
        new UglifyJSPlugin(),
        extractEditor,
        extractMain
    );
//development
} else {
    plugins.push(
        //auto updating on dev server
        new webpack.HotModuleReplacementPlugin(),
        //shows relative path in HotModuleReplacement
        new webpack.NamedModulesPlugin(),
        //sexy dashboard
        new DashboardPlugin(),
        extractEditor
    );
}

plugins.push(
    new webpack.ProvidePlugin(
        {
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }
    )
);



/**
 *
 * load files
 */
const sources = [
    `../${THEME_NAME}/src`,
    `../${THEME_NAME}_mysite/src`
];

const sassFolders = sources.map((source) => path.resolve(source, "scss"))
    .concat(sources.map((source) => path.resolve(source, "sass")));

//HMR can be fixed by using basic loaders instead of textExtract
const sassLoaderExtract =    {
    fallback: 'style-loader',
    use: [
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true
            }
        },
    ]
}



/**
 * loads  custom scss / sass files
 *
 */
const styleLoaders = [{
    //basic css
    test: /\.css/i,
    use: ['style-loader', 'css-loader']
}, {
    //main styles
    test: /[^editor].\.s(a|c)ss$/i,
    include: sassFolders,
    use: extractMain.extract(sassLoaderExtract)
}, {
    //styles for editor
    test: /editor\.s(a|c)ss/i,
    include: sassFolders,
    use: extractEditor.extract(sassLoaderExtract)
}];



/**
 * loads  custom javascript files
 *
 */
var jsLoaders = [
    // KEEP THE CODE BELOW AND TURN ON IF NEEDED....
    // {
    //     //eslint check
    //     enforce: 'pre',
    //     test: /\.js$/i,
    //     exclude: /node_modules/,
    //     use: {
    //         loader: 'eslint-loader'
    //     }
    // },
    {
        //js compilation
        test: /\.js$/i,
        include: sources.map((source) => path.resolve(source, "src")),
        exclude: /node_modules/,
        include: [
               /node_modules\/uglify-es/
        ],
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [require.resolve("babel-preset-es2015")]
            }
        }
    }
];

if(IS_PROD) {
    jsLoaders.push(
        {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            },{
                loader: 'expose-loader',
                options: '$'
            }]
        }
    );
}

const imageLoaders = [
    {
        test: /\.(png|jpg|gif)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 30000
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    optipng: {
                        optimizationLevel: 5
                    },
                    mozjpeg: {
                        interlaced: true,
                    }
                }
            }
        ]
    },
    {
        test: /\.svg$/i,
        use: 'svg-inline-loader'
    }
];






/*
    Main Config Object
 */


export default {

    //what files to start from
    //bundle should include main.js from all sources
    entry: path.resolve(`../${THEME_NAME}_mysite/src`, "main.js"),

    //access from client
    output: {
        path: path.resolve(`../${DISTRIBUTION_FOLDER}/`, ''),
        publicPath: `http://localhost:3000/themes/${DISTRIBUTION_FOLDER}/`,
        filename: 'bundle.js'
    },

    //loaders - css / js / images
    module: {
        rules: styleLoaders.concat(jsLoaders).concat(imageLoaders)
    },

    //extra settings
    resolve: {

        //node modules to include
        modules: [
            path.join(__dirname, "node_modules"),
            path.resolve(`../${THEME_NAME}_node_modules/node_modules`),
            path.resolve(`../${THEME_NAME}_mysite/node_modules/`)
        ],

        //aliases
        alias: {
            site: path.resolve(`./../../`),
            base: path.resolve(`../${THEME_NAME}/src/`),
            mysite: path.resolve(`../${THEME_NAME}_mysite/src/`),
            'jquery': 'jquery/dist/jquery',
            'jQuery': 'jquery/dist/jquery'
        },
        extensions: [".js", ".jsx"]
    },

    //dev server setup
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        hot: true,
        port: 3000,
        headers: { 'Access-Control-Allow-Origin': '*' },
        publicPath: `http://localhost:3000/themes/${DISTRIBUTION_FOLDER}/`,
        // proxy: {
        //     '/': {
        //         'target': {
        //             'host': ,
        //             'protocol': 'http',
        //             'port': 80
        //         },
        //         changeOrigin: true,
        //         secure: false
        //     }
        // },
        stats: 'errors-only'
    },

    //plugins
    plugins: plugins
};
