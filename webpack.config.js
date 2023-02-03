const path = require('path')
/*
 * get variables
 */

const ROOT_DIR_PROIVDED = process.env.npm_config_root_dir         || '../..'
const THEME_DIR_PROIVDED = process.env.npm_config_theme_dir       || 'themes/error-use-theme_dir-parameter-to-set-target-folder'
const NODE_DIR_PROIVDED = process.env.npm_config_node_dir         || THEME_DIR_PROIVDED + '/my_node_modules'
const JS_FILE_PROIVDED = process.env.npm_config_js_file           || 'src/main.js'
const CSS_FILE_PROIVDED = process.env.npm_config_css_file         || 'src/style.scss'
const EDITOR_FILE_PROIVDED = process.env.npm_config_editor_file   || ''
const DIST_DIR_PROIVDED = process.env.npm_config_dist_dir         || THEME_DIR_PROIVDED + '/dist'

/*
 * compile variables
 */
const ROOT_DIR     = path.resolve(ROOT_DIR_PROIVDED)
const THEME_DIR    = path.resolve(ROOT_DIR_PROIVDED + '/' + THEME_DIR_PROIVDED)
const JS_FILE      = path.resolve(THEME_DIR +         '/' + JS_FILE_PROIVDED)
const CSS_FILE     = path.resolve(THEME_DIR +         '/' + CSS_FILE_PROIVDED)
const NODE_DIR     = path.resolve(ROOT_DIR_PROIVDED + '/' + NODE_DIR_PROIVDED + '/node_modules')
const DIST_DIR     = path.resolve(ROOT_DIR_PROIVDED + '/' + DIST_DIR_PROIVDED)
let EDITOR_FILE = '';
if (EDITOR_FILE_PROIVDED) {
  EDITOR_FILE  = path.resolve(THEME_DIR +         '/' + EDITOR_FILE_PROIVDED)
}

/*
 * Report details to console
 */
const THEMED_DIR_FOR_REPLACE = THEME_DIR + '/'
console.log('--------------------------------')
console.log('REQUIRED')
console.log('--------------------------------')
console.log('--theme_dir:        location of theme / module (# NB this dir should contain a src folder')
console.log('               =    ' + THEME_DIR_PROIVDED.replace(path.resolve(ROOT_DIR_PROIVDED), './'))
console.log('               =>   ' + THEME_DIR_PROIVDED)
console.log('             e.g    --theme_dir=themes/mytheme')
console.log('                    --theme_dir=vendor/vendor-name/package-name/client')


console.log('--------------------------------')
console.log('OPTIONAL')
console.log('--------------------------------')
console.log('--js_file:          javascript entry file')
console.log('               =    ' + JS_FILE.replace(THEMED_DIR_FOR_REPLACE, './'))
console.log('               =>   ' + JS_FILE)
console.log('             e.g    --js_file=' + JS_FILE_PROIVDED)
console.log('')
console.log('--css_file:         css entry point file')
console.log('               =    ' + CSS_FILE.replace(THEMED_DIR_FOR_REPLACE, './'))
console.log('             e.g.   --css_file=' + CSS_FILE_PROIVDED)
console.log('')
if(EDITOR_FILE_PROIVDED) {
  console.log('--editor_file:      editor css file entry point')
  console.log('               =    ' + EDITOR_FILE.replace(THEMED_DIR_FOR_REPLACE, './'))
  console.log('             e.g.   --editor_file=' + EDITOR_FILE_PROIVDED)
  console.log('')
} else {
  console.log('--editor_file:      editor css file entry point - NOT PROVIDED')
}
console.log('--------------------------------')
console.log('--node_dir:         location of node_modules dir')
console.log('               =    ' + NODE_DIR.replace(THEMED_DIR_FOR_REPLACE, './'))
console.log('               =>    ' + NODE_DIR)
console.log('             e.g.   --node_dir=' + NODE_DIR_PROIVDED)
console.log('')
console.log('--------------------------------')
console.log('--dist_dir:         destination distill dir')
console.log('               =    ' + DIST_DIR.replace(THEMED_DIR_FOR_REPLACE, './'))
console.log('               =>   ' + DIST_DIR)
console.log('             e.g.   --dist_dir=' + DIST_DIR_PROIVDED)
console.log('')

console.log('--------------------------------')
console.log('EXAMPLES')
console.log('--------------------------------')
console.log('npm run dev         --themes_dir=themes/mytheme/client --js_file=myfile.js')
console.log('npm run watch       --themes_dir=themes/mytheme/client --css_file=myfile.scss')
console.log('npm run build       --themes_dir=themes/mytheme/client')
console.log('--------------------------------')


Encore = require('@symfony/webpack-encore');

const lastDirInDistDir = DIST_DIR.match(/([^\/]*)\/*$/)[1] ?? 'dist'

Encore
    // directory where all compiled assets will be stored
    .setOutputPath(DIST_DIR)

    // what's the public path to this directory (relative to your project's document root dir)
    .setPublicPath('./')

    // empty the outputPath dir before each build
    // .cleanupOutputBeforeBuild()

    // will output as web/build/app.js
    .addEntry('app', JS_FILE)

    // will output as web/build/global.css
    .addStyleEntry('main', CSS_FILE)

    // allow sass/scss files to be processed
    .enableSassLoader()

    // allow legacy applications to use $/jQuery as a global variable
    .autoProvidejQuery()
    .autoProvideVariables({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    })

    .enableSourceMaps(!Encore.isProduction())

    .enableSingleRuntimeChunk()
    //.disableSingleRuntimeChunk()

    .setManifestKeyPrefix(lastDirInDistDir)

    // create hashed filenames (e.g. app.abc123.css)
    //.enableVersioning()

    .addAliases({
        'my_node_modules': NODE_DIR,
        'modules': NODE_DIR,
        '~': ROOT_DIR,
        'PROJECT_ROOT_DIR': ROOT_DIR,
    })
;

if(EDITOR_FILE) {
    // will output editor.css file MCE Tiny Editor
  Encore.addStyleEntry('editor', EDITOR_FILE)
}


// Use polling instead of inotify
const config = Encore.getWebpackConfig();
config.resolve.modules = []
config.resolve.modules.push(NODE_DIR)


console.log('--------------------------------')
console.log('ALIASES AVAILABLE, add ~ in scss to make it work')
console.log('--------------------------------')
console.log(config.resolve.alias)
console.log('--------------------------------')

//-------------------------
// add more files to watch ...
// import WatchExternalFilesPlugin from 'webpack-watch-files-plugin'
// config.watchOptions = {
//     poll: 250
// };

// config.plugins.push(
//   new WatchExternalFilesPlugin({
//     files: [
//       THEME_DIR_PROIVDED
//     ]
//   })
// )
//-------------------------

// Export the final configuration
module.exports = config;
