# Base SilverStripe theme with a webpack build system

A drop-in webpack build engine for SilverStripe that can compile the front-end
assets of **any** theme or vendor package from one place.

It is powered by [Symfony Encore](https://www.npmjs.com/package/@symfony/webpack-encore).

---

## Requirements

- A recent **Node.js** and **npm**. Using [nvm](https://github.com/nvm-sh/nvm)
  is recommended — the helper script below will automatically pick up your nvm
  node if it is installed.
- **npm 12+ note:** you can no longer pass build options as `--flags` to
  `npm run` (npm 12 rejects unknown flags). This engine passes everything as
  environment variables instead. The `webpack` helper script does this for you.

---

## Installation

1. Install this module into your `themes/` folder as `sswebpack_engine_only`
   (Composer does this automatically).

2. Create the front-end files for your theme — see the
   [`examples-from-root-of-project`](https://github.com/sunnysideup/silverstripe-sswebpack_engine_only/blob/master/examples-from-root-of-project)
   folder for the exact files you need.

3. Expose your theme's `dist` folder in the public resources folder via Composer,
   as usual.

4. Install dependencies:

   ```bash
   themes/sswebpack_engine_only/bin/webpack install themes/mytheme
   ```

> **Tip:** add the helper to your `PATH` or create an alias so you can just type
> `webpack …` from your project root:
>
> ```bash
> alias webpack='./themes/sswebpack_engine_only/bin/webpack'
> ```
>
> The examples below assume you have done this. Always run it from the **base
> folder of your project**.

---

## Usage

```bash
webpack <command> [theme-dir]
```

| Command   | What it does                                                        |
|-----------|---------------------------------------------------------------------|
| `install` | Install engine deps **and** the theme's project modules             |
| `hot`     | Dev build served with **hot reloading** (CSS hot-injection)         |
| `watch`   | Dev build, rebuilt on every save (to disk, no browser integration)  |
| `build`   | Production build                                                     |

`theme-dir` is optional. If omitted, the first folder under `./themes/` that
contains `src/main.js` is used (the engine folder is skipped). A theme can live
anywhere:

```bash
webpack watch                                    # auto-detect a theme
webpack build themes/mytheme
webpack build vendor/myvendor/mypackage/client
```

### Calling npm directly (advanced)

If you bypass the helper, run npm from inside the engine folder and pass the
theme as an **environment variable**, not a flag:

```bash
cd themes/sswebpack_engine_only
WEBPACK_THEME_DIR=themes/mytheme npm run build     # ✅ works
npm run build --theme_dir=themes/mytheme           # ❌ fails on npm 12
```

---

## Hot reloading (`webpack hot`)

`hot` runs the Encore dev-server with **CSS hot-injection**: save a `.scss` file
and the styles update in the browser with no page reload. The dev-server writes
its bundles to disk at your theme's `dist/` path, so your existing hardcoded
`<script>` includes keep working unchanged.

A couple of things to know:

- **The `main.css` `<link>`.** While `hot` is running there is no separate
  `main.css` — the CSS is injected from the JS. Gate that one `<link>` behind a
  dev-server flag in your template (or accept a harmless 404 in dev).
- **https dev sites.** If your SilverStripe dev site runs over `https`, the
  browser blocks the `ws://localhost:8080` HMR socket as mixed content. Serve
  the dev site over plain `http`, or switch the dev-server to https.
- **Fallback.** If hot reloading misbehaves, run `webpack watch` instead — it
  just rebuilds to disk and you refresh the browser yourself. Or force a
  full-page reload with `WEBPACK_HMR=no webpack hot`.

---

## Options

Set these as environment variables **before** the command:

| Variable                    | Default                        | Purpose                              |
|-----------------------------|--------------------------------|--------------------------------------|
| `WEBPACK_INCLUDE_JQUERY=no` | jQuery included                | Exclude jQuery from the bundle       |
| `WEBPACK_JS_FILE`           | `src/main.js`                  | JS entry point                       |
| `WEBPACK_CSS_FILE`          | `src/style.scss`               | CSS entry point                      |
| `WEBPACK_EDITOR_FILE`       | `src/editor.scss`              | Editor (TinyMCE) CSS entry point     |
| `WEBPACK_DIST_DIR`          | `<theme-dir>/dist`             | Output folder                        |
| `WEBPACK_NODE_DIR`          | `<theme-dir>/my_node_modules`  | Extra node_modules location          |
| `WEBPACK_HMR=no`            | on                             | `hot` only: full reload vs hot-inject|
| `WEBPACK_DEV_HOST`          | `localhost`                    | `hot` only: dev-server host          |
| `WEBPACK_DEV_PORT`          | `8080`                         | `hot` only: dev-server port          |

Example:

```bash
WEBPACK_INCLUDE_JQUERY=no webpack build vendor/myvendor/mypackage/client
```

---

## Good to know

### Required structure

Your theme name can be anything (`mytheme` is just an example), and this works on
vendor packages too. Each buildable theme needs:

```
mytheme/
├── src/
│   ├── main.js       # JS entry — import your other JS/SCSS from here
│   ├── style.scss    # CSS entry
│   └── editor.scss   # optional: TinyMCE editor styles
├── dist/             # compiled output (expose this via Composer)
└── my_node_modules/  # optional: extra npm packages (with its own package.json)
```

- `main.js` and `style.scss` are the entry points — everything else is imported
  from them.
- To add extra npm packages for a theme, put a `package.json` in
  `mytheme/my_node_modules/` (or in `mytheme/src/`) and run `npm init -y &&
  npm install` there. `webpack install` will pick up `my_node_modules/`
  automatically.

### jQuery

- jQuery is aliased, so you can use it anywhere without importing it.
- It is also exposed on the global namespace (`window.jQuery`).
- Turn it off entirely with `WEBPACK_INCLUDE_JQUERY=no`.

### Editor file

There is an option to compile a separate editor stylesheet
(`src/editor.scss`) for your TinyMCE HTML editor. Run any build command and the
report at the top of the output shows which entry points were picked up.

### Including the build files in your templates

Two options:

1. **Automatically** — add
   [`sunnysideup/webpack_requirements_backend`](https://github.com/sunnysideup/silverstripe-webpack_requirements_backend)
   via Composer and follow its docs to inject the required files.

2. **Manually** — reference the compiled files from the exposed `dist` folder,
   for example:

   ```html
   <script src="/_resources/themes/mytheme/dist/runtime.js"></script>
   <script src="/_resources/themes/mytheme/dist/app.js"></script>
   <link href="/_resources/themes/mytheme/dist/main.css" rel="stylesheet">
   ```

   (Remember to gate the `main.css` link when running `webpack hot` — see the
   hot-reloading section above.)
