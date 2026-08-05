# Base SilverStripe theme with a webpack build system

A drop-in webpack build engine for SilverStripe that can compile the front-end
assets of **any** theme or vendor package from one place.

It is powered by [Symfony Encore](https://www.npmjs.com/package/@symfony/webpack-encore).

---

## Requirements

- A recent **Node.js** and **npm**. Using [nvm](https://github.com/nvm-sh/nvm)
  is recommended — the `webpack` helper script automatically picks up your nvm
  node if it is installed.
- **npm 12+ note:** npm 12 rejects unknown `--flags` on `npm run`, so build
  options are passed as environment variables under the hood. The `webpack`
  helper turns your command-line flags into those variables for you, so you
  never deal with this directly.

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
   vendor/bin/webpack install
   ```

> **Tip:** add an alias so you can just type `webpack …` from your project root:
>
> ```bash
> alias webpack='./vendor/bin/webpack'
> ```
>
> The examples below assume you have done this. Always run it from the **base
> folder of your project**.

---

## Usage

```bash
webpack <command> [theme-dir] [options]
```

| Command   | What it does                                                        |
|-----------|---------------------------------------------------------------------|
| `install` | Install engine deps **and** the theme's project modules             |
| `hot`     | Dev build served with **hot reloading** (CSS hot-injection)         |
| `watch`   | Dev build, rebuilt on every save (to disk, no browser integration)  |
| `build`   | Production build                                                     |

`theme-dir` is optional (you can also give it with `-t`). If omitted, the first
folder under `./themes/` that contains `src/main.js` is used (the engine folder
is skipped). A theme can live anywhere:

```bash
webpack watch                                    # auto-detect a theme
webpack build themes/mytheme
webpack build vendor/myvendor/mypackage/client --no-jquery
```

### Options

Options are ordinary flags — the helper translates them into the environment
variables the config reads.

| Flag                     | Default                        | Purpose                                   |
|--------------------------|--------------------------------|-------------------------------------------|
| `-t, --theme DIR`        | auto-detect                    | Theme directory (same as the positional)  |
| `-j, --js FILE`          | `src/main.js`                  | JS entry point                            |
| `-c, --css FILE`         | `src/style.scss`               | CSS entry point                           |
| `-e, --editor FILE`      | `src/editor.scss`              | Editor (TinyMCE) CSS entry point          |
| `-d, --dist DIR`         | `<theme>/dist`                 | Output folder                             |
| `-n, --node-dir DIR`     | `<theme>/my_node_modules`      | Extra node_modules location               |
| `--jquery` / `--no-jquery` | excluded                     | Include / exclude jQuery in the bundle    |
| `-h, --help`             |                                | Show help                                 |

`hot`-only flags:

| Flag                 | Default                          | Purpose                                        |
|----------------------|----------------------------------|------------------------------------------------|
| `--no-hmr`           | HMR on                           | Full page reload instead of CSS hot-inject     |
| `--host HOST`        | `localhost`                      | dev-server host                                |
| `--port PORT`        | `8080`                           | dev-server port                                |
| `--public-path PATH` | `/_resources/<dist>`             | URL path the dist is served at                 |
| `--ws-url URL`       | derived from `SS_BASE_URL`       | HMR socket URL (see hot reloading, below)      |

Example:

```bash
webpack build vendor/myvendor/mypackage/client --no-jquery
```

### Calling npm directly (advanced)

If you bypass the helper, run npm from inside the engine folder and pass the
theme as an **environment variable**, not a flag:

```bash
cd themes/sswebpack_engine_only
WEBPACK_THEME_DIR=themes/mytheme npm run build     # ✅ works
npm run build --theme_dir=themes/mytheme           # ❌ fails on npm 12
```

Every flag above has a matching `WEBPACK_*` variable (`--css` → `WEBPACK_CSS_FILE`,
`--no-jquery` → `WEBPACK_INCLUDE_JQUERY=no`, and so on).

---

## Hot reloading (`webpack hot`)

`hot` runs the Encore dev-server with **CSS hot-injection**: save a `.scss` file
and the styles update in the browser with no page reload.

The nice part: **your template includes stay identical to production.** The
dev-server writes its bundles to disk at your theme's `dist/` path, so
SilverStripe serves the JS/CSS (and the hot-update chunks) from `/_resources/…`
exactly as it does in production. The only thing that needs the dev-server is a
small notification socket — and that is routed through your own domain, so no
`localhost:8080` ever appears in a URL.

### One-time Apache setup

The helper reads `SS_BASE_URL` from your project's `.env` and derives the socket
URL automatically (`http://…` → `ws://…/ws`, `https://…` → `wss://…/ws`). You
just forward `/ws` to the dev-server. Add these two lines inside your site's
`<VirtualHost>` block:

```apache
# webpack dev-server HMR socket — only used while running `webpack hot`
ProxyPass        /ws  ws://127.0.0.1:8080/ws
ProxyPassReverse /ws  ws://127.0.0.1:8080/ws
```

Enable the proxy modules once and restart:

```bash
sudo a2enmod proxy proxy_wstunnel
sudo systemctl restart apache2
```

Then just run:

```bash
webpack hot themes/mytheme
```

Because the socket uses the same scheme and domain as your page, an **https**
dev site works too (it becomes `wss://…`) — no mixed-content problem.

### The one caveat: `main.css`

While `hot` runs with HMR on, the CSS is injected from the JS and **no
`main.css` file is emitted**, so that one `<link>` 404s (harmless, with a brief
flash of unstyled content on first paint). Two ways to handle it:

- Gate the `main.css` `<link>` behind a dev flag in your template, **or**
- Run `webpack hot themes/mytheme --no-hmr` — this keeps `main.css` on disk and
  does a full page reload on save instead, so every link is byte-for-byte
  identical to production.

### Simplest fallback: `watch`

If you would rather not touch Apache at all, `webpack watch` writes the real
`runtime.js`, `app.js`, and `main.css` to `dist/` on every save. Your production
links already point there — just refresh the browser yourself. No dev-server, no
port, no socket, no template change.

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
  `mytheme/my_node_modules/` (or in `mytheme/src/`) and run
  `npm init -y && npm install` there. `webpack install` picks up
  `my_node_modules/` automatically.

### jQuery

- jQuery is **not bundled by default**. Add it with `--jquery`.
- When included, it is aliased so you can use it anywhere without importing it,
  and exposed on the global namespace (`window.jQuery`).

### Editor file

There is an option to compile a separate editor stylesheet (`src/editor.scss`)
for your TinyMCE HTML editor. Run any build command and the report at the top of
the output shows which entry points were picked up.

### Including the build files in your templates

Two options:

1. **Automatically** — add
   [`sunnysideup/webpack_requirements_backend`](https://github.com/sunnysideup/silverstripe-webpack_requirements_backend)
   via Composer and follow its docs to inject the required files.

2. **Manually** — reference the compiled files from the exposed `dist` folder:

   ```html
   <script src="/_resources/themes/mytheme/dist/runtime.js"></script>
   <script src="/_resources/themes/mytheme/dist/app.js"></script>
   <link href="/_resources/themes/mytheme/dist/main.css" rel="stylesheet">
   ```

   `runtime.js` is required in production too (it holds webpack's bootstrap from
   `enableSingleRuntimeChunk`), and must load **before** `app.js`. See the hot
   reloading section for the `main.css` note during `webpack hot`.
  