const path = require('path')
/*
 * get variables
 */

const ROOT_DIR_PROVIDED = process.env.npm_config_root_dir || '../..'
const THEME_DIR_PROVIDED =
  process.env.npm_config_theme_dir ||
  'themes/error-use-theme_dir-parameter-to-set-target-folder'
const NODE_DIR_PROVIDED =
  process.env.npm_config_node_dir || THEME_DIR_PROVIDED + '/my_node_modules'
const JS_FILE_PROVIDED = process.env.npm_config_js_file || 'src/main.js'
const CSS_FILE_PROVIDED = process.env.npm_config_css_file || 'src/style.scss'
const EDITOR_FILE_PROVIDED =
  process.env.npm_config_editor_file || 'src/editor.scss'
const DIST_DIR_PROVIDED =
  process.env.npm_config_dist_dir || THEME_DIR_PROVIDED + '/dist'
const INCLUDE_JQUERY_PROVIDED = process.env.npm_config_include_jquery || 'yes'

/*
 * compile variables
 */
const ROOT_DIR = path.resolve(ROOT_DIR_PROVIDED)
const THEME_DIR = path.resolve(ROOT_DIR_PROVIDED + '/' + THEME_DIR_PROVIDED)
const JS_FILE = path.resolve(THEME_DIR + '/' + JS_FILE_PROVIDED)
const CSS_FILE = path.resolve(THEME_DIR + '/' + CSS_FILE_PROVIDED)
const NODE_DIR = path.resolve(
  ROOT_DIR_PROVIDED + '/' + NODE_DIR_PROVIDED + '/node_modules'
)
const DIST_DIR = path.resolve(ROOT_DIR_PROVIDED + '/' + DIST_DIR_PROVIDED)
const JQ_INCLUDED = INCLUDE_JQUERY_PROVIDED.toLowerCase() !== 'no'
let EDITOR_FILE = ''
if (EDITOR_FILE_PROVIDED) {
  EDITOR_FILE = path.resolve(THEME_DIR + '/' + EDITOR_FILE_PROVIDED)
}

/*
 * Report details to console
 */
const THEMED_DIR_FOR_REPLACE = THEME_DIR + '/'
console.log('--------------------------------')
console.log('REQUIRED')
console.log('--------------------------------')
console.log(
  '--theme_dir:        location of theme / module (# NB this dir should contain a src folder'
)
console.log(
  '               =    ' +
    THEME_DIR_PROVIDED.replace(path.resolve(ROOT_DIR_PROVIDED), './')
)
console.log('               =>   ' + THEME_DIR_PROVIDED)
console.log('             e.g    --theme_dir=themes/mytheme')
console.log(
  '                    --theme_dir=vendor/vendor-name/package-name/client'
)

console.log('--------------------------------')
console.log('OPTIONAL')
console.log('--------------------------------')
console.log('--js_file:          javascript entry file')
console.log(
  '               =    ' + JS_FILE.replace(THEMED_DIR_FOR_REPLACE, './')
)
console.log('               =>   ' + JS_FILE)
console.log('             e.g    --js_file=' + JS_FILE_PROVIDED)
console.log('')
console.log('--css_file:         css entry point file')
console.log(
  '               =    ' + CSS_FILE.replace(THEMED_DIR_FOR_REPLACE, './')
)
console.log('             e.g.   --css_file=' + CSS_FILE_PROVIDED)
console.log('')
if (EDITOR_FILE_PROVIDED) {
  console.log('--editor_file:      editor css file entry point')
  console.log(
    '               =    ' + EDITOR_FILE.replace(THEMED_DIR_FOR_REPLACE, './')
  )
  console.log('             e.g.   --editor_file=' + EDITOR_FILE_PROVIDED)
  console.log('')
} else {
  console.log('--editor_file:      editor css file entry point - NOT PROVIDED')
}
console.log('--------------------------------')
console.log('--node_dir:         location of node_modules dir')
console.log(
  '               =    ' + NODE_DIR.replace(THEMED_DIR_FOR_REPLACE, './')
)
console.log('               =>    ' + NODE_DIR)
console.log('             e.g.   --node_dir=' + NODE_DIR_PROVIDED)
console.log('')
console.log('--------------------------------')
console.log('--dist_dir:         destination distill dir')
console.log(
  '               =    ' + DIST_DIR.replace(THEMED_DIR_FOR_REPLACE, './')
)
console.log('               =>   ' + DIST_DIR)
console.log('             e.g.   --dist_dir=' + DIST_DIR_PROVIDED)
console.log('')
console.log('--include_jquery:   include jquery in dist (yes or no)')
console.log('               =    ' + (JQ_INCLUDED ? 'yes' : 'no'))
console.log('             e.g.   --include_jquery=no')
console.log('')

console.log('--------------------------------')
console.log('EXAMPLES')
console.log('--------------------------------')
console.log(
  'npm run dev         --themes_dir=themes/mytheme/client --js_file=myfile.js'
)
console.log(
  'npm run watch       --themes_dir=themes/mytheme/client --css_file=myfile.scss'
)
console.log('npm run build       --themes_dir=themes/mytheme/client')
console.log('--------------------------------')

Encore = require('@symfony/webpack-encore')

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

  .enableSourceMaps(!Encore.isProduction())

  .enableSingleRuntimeChunk()
  // .disableSingleRuntimeChunk()

  .setManifestKeyPrefix(lastDirInDistDir)

  // create hashed filenames (e.g. app.abc123.css)
  // .enableVersioning()

  .addAliases({
    my_node_modules: NODE_DIR,
    modules: NODE_DIR,
    '~': ROOT_DIR,
    PROJECT_ROOT_DIR: ROOT_DIR
  })
  // your existing Encore config
  .configureTerserPlugin(options => {
    options.terserOptions = {
      compress: {
        drop_console: true
      }
    }
  })
if (EDITOR_FILE) {
  // will output editor.css file MCE Tiny Editor
  Encore.addStyleEntry('editor', EDITOR_FILE)
}

if (JQ_INCLUDED) {
  // include jQuery as window.jQuery
  // allow legacy applications to use $/jQuery as a global variable
  Encore.autoProvidejQuery()
  Encore.autoProvideVariables({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  })
}

// Enable Hot Module Replacement (HMR) in development mode
// if (!Encore.isProduction()) {
//   Encore.disableCssExtraction() // Required for CSS HMR
//     .configureDevServerOptions(options => {
//       options.hot = true // Enable HMR for JavaScript
//       options.liveReload = true // Enable live reloading
//       options.watchFiles = [THEME_DIR + '/src/**/*'] // Watch for changes in these files
//       options.client = {
//         overlay: true // Show build errors in the browser
//       }
//       options.static = DIST_DIR // Serve files from the output directory
//       options.host = '0.0.0.0' // Allow access from the network
//       options.port = 8080 // Change port if needed
//     })
// }

// Use polling instead of inotify
const config = Encore.getWebpackConfig()
config.resolve.modules = []
config.resolve.modules.push(NODE_DIR)

console.log('--------------------------------')
console.log('ALIASES AVAILABLE, add ~ in scss to make it work')
console.log('--------------------------------')
console.log(config.resolve.alias)
console.log('--------------------------------')

//------------------------------- ADD SRI SUPPORT -------------------------------

const { exec } = require('child_process')

class RunCommandOnChange {
  apply (compiler) {
    compiler.hooks.watchRun.tap('RunCommandOnChange', compilation => {
      console.log('Code changed. Running custom command...')
      const scriptPath = path.resolve(__dirname, 'bash-on-compile.sh') // Ensure correct path
      console.log('Webpack is running in:', process.cwd())
      console.log('Running script:', scriptPath)
      exec(`bash ${scriptPath}`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing command: ${err}`)
          return
        }
        if (stdout) console.log(`Output: ${stdout}`)
        if (stderr) console.error(`Errors: ${stderr}`)
      })
    })
  }
}

// config.plugins.push(new RunCommandOnChange())

// -------------------------
// add more files to watch ...
// import WatchExternalFilesPlugin from 'webpack-watch-files-plugin'
// config.watchOptions = {
//     poll: 250
// };

// config.plugins.push(
//   new WatchExternalFilesPlugin({
//     files: [
//       THEME_DIR_PROVIDED
//     ]
//   })
// )
// -------------------------

// Export the final configuration
module.exports = config
