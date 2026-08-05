const path = require('node:path')
const fs = require('node:fs')
const Encore = require('@symfony/webpack-encore')

/* -------------------------------------------------------------------------- *
 *  Parameters
 *
 *  IMPORTANT (npm 12+): you can NO LONGER pass `npm run build --theme_dir=x`.
 *  npm 12 rejects unknown --flags with "Unknown cli flags" and exits 1.
 *  Pass values as environment variables instead, e.g.:
 *
 *      WEBPACK_THEME_DIR=themes/mytheme npm run build
 *
 *  `arg()` reads, in order:
 *    1. WEBPACK_<NAME>        (recommended, works on every npm)
 *    2. npm_config_<name>     (legacy: old `--flag` style on npm <= 10)
 *    3. the supplied default
 *
 *  Paths are resolved relative to root_dir, which defaults to `../..`
 *  because the scripts run from inside themes/sswebpack_engine_only/.
 * -------------------------------------------------------------------------- */
const arg = (name, fallback) =>
  process.env[`WEBPACK_${name.toUpperCase()}`] ??
  process.env[`npm_config_${name}`] ??
  fallback

const ROOT_DIR_PROVIDED = arg('root_dir', '../..')

const THEME_DIR_PROVIDED = arg(
  'theme_dir',
  'themes/error-set-WEBPACK_THEME_DIR-to-your-target-folder'
)

const NODE_DIR_PROVIDED = arg('node_dir', `${THEME_DIR_PROVIDED}/my_node_modules`)
const DIST_DIR_PROVIDED = arg('dist_dir', `${THEME_DIR_PROVIDED}/dist`)

const JS_FILE_PROVIDED = arg('js_file', 'src/main.js')
const CSS_FILE_PROVIDED = arg('css_file', 'src/style.scss')
const EDITOR_FILE_PROVIDED = arg('editor_file', 'src/editor.scss')

const INCLUDE_JQUERY_PROVIDED = arg('include_jquery', 'yes')

// Dev-server host/port (override with WEBPACK_DEV_HOST / WEBPACK_DEV_PORT)
const DEV_HOST = arg('dev_host', 'localhost')
const DEV_PORT = Number(arg('dev_port', '8080'))

// URL path SilverStripe exposes the dist folder at (mirrors the on-disk path
// under _resources). Override with WEBPACK_PUBLIC_PATH if your layout differs.
const PUBLIC_PATH_DEV = arg('public_path', `/_resources/${DIST_DIR_PROVIDED}`)

// Public URL the browser uses for the HMR socket. Default talks to the
// dev-server directly; set WEBPACK_WS_URL (the webpack script derives it from
// SS_BASE_URL) when proxying the socket behind your own domain via Apache.
const WS_URL = arg('ws_url', `ws://${DEV_HOST}:${DEV_PORT}/ws`)

// Hot Module Replacement toggle for the dev-server.
//   on  (default): CSS hot-injection, no page reload, no main.css emitted.
//   off:           full page reload on save, main.css emitted (template unchanged).
// Turn off with WEBPACK_HMR=no if hot-reloading misbehaves.
const HMR_ON = String(arg('hmr', 'yes')).toLowerCase() !== 'no'

/* -------------------------------------------------------------------------- *
 *  Resolve to absolute paths (semantics preserved from the original config)
 * -------------------------------------------------------------------------- */
const ROOT_DIR = path.resolve(ROOT_DIR_PROVIDED)
const THEME_DIR = path.resolve(ROOT_DIR_PROVIDED, THEME_DIR_PROVIDED)
const JS_FILE = path.resolve(THEME_DIR, JS_FILE_PROVIDED)
const CSS_FILE = path.resolve(THEME_DIR, CSS_FILE_PROVIDED)
const NODE_DIR = path.resolve(ROOT_DIR_PROVIDED, NODE_DIR_PROVIDED, 'node_modules')
const DIST_DIR = path.resolve(ROOT_DIR_PROVIDED, DIST_DIR_PROVIDED)

const EDITOR_FILE = EDITOR_FILE_PROVIDED
  ? path.resolve(THEME_DIR, EDITOR_FILE_PROVIDED)
  : ''

const JQ_INCLUDED = String(INCLUDE_JQUERY_PROVIDED).toLowerCase() !== 'no'
const MANIFEST_PREFIX = path.basename(DIST_DIR) || 'dist'

const IS_DEV_SERVER = Encore.isDevServer()

/* -------------------------------------------------------------------------- *
 *  Report
 * -------------------------------------------------------------------------- */
const rel = (abs) => path.relative(ROOT_DIR, abs) || '.'
const row = (label, value) => console.log(`  ${label.padEnd(16)}${value}`)
const rule = () => console.log('  ' + '-'.repeat(60))

rule()
console.log(`  webpack-encore ${IS_DEV_SERVER ? 'dev-server (HMR)' : 'build'}`)
rule()
row('theme_dir', `${rel(THEME_DIR)}   (${THEME_DIR})`)
row('js_file', rel(JS_FILE))
row('css_file', rel(CSS_FILE))
row('editor_file', EDITOR_FILE ? rel(EDITOR_FILE) : '(none)')
row('node_dir', rel(NODE_DIR))
row('dist_dir', rel(DIST_DIR))
row('include_jquery', JQ_INCLUDED ? 'yes' : 'no')
if (IS_DEV_SERVER) row('dev_server', `http://${DEV_HOST}:${DEV_PORT}`)
if (IS_DEV_SERVER) row('served_at', PUBLIC_PATH_DEV)
if (IS_DEV_SERVER) row('hmr_socket', WS_URL)
if (IS_DEV_SERVER) row('hmr', HMR_ON ? 'on (CSS hot-inject)' : 'off (full reload)')
rule()
console.log('  examples (env-var style — required on npm 12+):')
console.log('    WEBPACK_THEME_DIR=themes/mytheme/client npm run build')
console.log('    WEBPACK_THEME_DIR=themes/mytheme/client npm run watch')
console.log('    WEBPACK_THEME_DIR=themes/mytheme/client npm run dev-server')
rule()

/* -------------------------------------------------------------------------- *
 *  Fail fast on obvious misconfiguration
 * -------------------------------------------------------------------------- */
if (!fs.existsSync(THEME_DIR)) {
  console.error(`\n  \u2717 theme_dir does not exist: ${THEME_DIR}`)
  console.error('    Set WEBPACK_THEME_DIR=themes/your-theme (run from the project base).\n')
  process.exit(1)
}
for (const [label, file] of [['js_file', JS_FILE], ['css_file', CSS_FILE]]) {
  if (!fs.existsSync(file)) {
    console.error(`\n  \u2717 ${label} not found: ${file}\n`)
    process.exit(1)
  }
}
if (EDITOR_FILE && !fs.existsSync(EDITOR_FILE)) {
  console.warn(`  ! editor_file not found, skipping: ${EDITOR_FILE}`)
}

/* -------------------------------------------------------------------------- *
 *  Encore configuration
 * -------------------------------------------------------------------------- */
Encore
  .setOutputPath(DIST_DIR)
  .setManifestKeyPrefix(MANIFEST_PREFIX)
  .addEntry('app', JS_FILE)
  .addStyleEntry('main', CSS_FILE)
  .enableSassLoader()
  .enableSourceMaps(!Encore.isProduction())
  .enableSingleRuntimeChunk()
  .addAliases({
    my_node_modules: NODE_DIR,
    modules: NODE_DIR,
    '~': ROOT_DIR,
    PROJECT_ROOT_DIR: ROOT_DIR
  })
  .configureTerserPlugin((options) => {
    options.terserOptions = {
      compress: { drop_console: Encore.isProduction() }
    }
  })

/* -------------------------------------------------------------------------- *
 *  Public path + dev-server / HMR
 *
 *  Normal build: relative public path ('./'), CSS extracted to files.
 *  dev-server:   ABSOLUTE public path pointing at the dev server, because the
 *                HTML is served by SilverStripe on a *different* origin, so the
 *                browser must fetch assets + the HMR socket from this URL.
 *                CSS extraction is disabled so styles hot-swap via style-loader.
 * -------------------------------------------------------------------------- */
if (IS_DEV_SERVER) {
  // Serve assets from the SAME /_resources path your templates already use,
  // and WRITE them to disk so your existing hardcoded includes load the dev
  // bundles unchanged.
  Encore.setPublicPath(PUBLIC_PATH_DEV)

  if (HMR_ON) {
    // CSS is bundled into the JS and injected as <style> tags (style-loader),
    // so it hot-swaps on save with no page reload. No main.css is emitted, so
    // gate the <link> in your template on the dev-server flag.
    Encore.disableCssExtraction()
  }
  // else: extraction stays ON — main.css is emitted and your normal <link>
  //       works unchanged; a save triggers a full page reload instead.

  Encore.configureDevServerOptions((options) => {
    options.hot = HMR_ON
    options.liveReload = !HMR_ON // fallback: full-page reload on every change
    options.host = DEV_HOST
    options.port = DEV_PORT
    options.allowedHosts = 'all'
    options.static = false
    options.headers = { 'Access-Control-Allow-Origin': '*' }
    // mirror every compile to disk so SilverStripe serves the fresh bundles
    // (and the hot-update chunks) at the /_resources path above
    options.devMiddleware = { writeToDisk: true }
    // page + assets are same-origin; only the HMR socket talks to :8080
    options.client = {
      webSocketURL: WS_URL,
      overlay: true
    }
  })
} else {
  Encore.setPublicPath('./')
}

// optional editor stylesheet (TinyMCE)
if (EDITOR_FILE && fs.existsSync(EDITOR_FILE)) {
  Encore.addStyleEntry('editor', EDITOR_FILE)
}

// optional jQuery as a global ($ / jQuery / window.jQuery) for legacy code
if (JQ_INCLUDED) {
  Encore.autoProvidejQuery()
  Encore.autoProvideVariables({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  })
}

/* -------------------------------------------------------------------------- *
 *  Raw webpack config tweaks
 * -------------------------------------------------------------------------- */
const config = Encore.getWebpackConfig()

// custom node_modules first, then the standard lookup as a fallback
config.resolve.modules = [NODE_DIR, 'node_modules']

rule()
console.log('  aliases (use ~ in scss to reference the project root):')
console.log(config.resolve.alias)
rule()

/* -------------------------------------------------------------------------- *
 *  Optional: run a shell script on every rebuild (e.g. SRI generation)
 * -------------------------------------------------------------------------- */
const { exec } = require('node:child_process')

class RunCommandOnChange {
  apply (compiler) {
    compiler.hooks.watchRun.tap('RunCommandOnChange', () => {
      const scriptPath = path.resolve(__dirname, 'bash-on-compile.sh')
      console.log(`Code changed — running: ${scriptPath}`)
      exec(`bash ${scriptPath}`, (err, stdout, stderr) => {
        if (err) return console.error(`Error executing command: ${err}`)
        if (stdout) console.log(`Output: ${stdout}`)
        if (stderr) console.error(`Errors: ${stderr}`)
      })
    })
  }
}

// config.plugins.push(new RunCommandOnChange())

/* -------------------------------------------------------------------------- *
 *  Optional: polling instead of inotify (handy on VMs / mounted volumes)
 * -------------------------------------------------------------------------- */
// config.watchOptions = { poll: 250 }

module.exports = config
