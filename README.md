# Base SilverStripe theme with a webpack build system

This webpack install allows you to compile any project / vendor/package.

It uses [symphony encore](https://www.npmjs.com/package/@symfony/webpack-encore) to make it fly!

## Installation

 - Install this to your themes folder as `sswebpack_engine_only` (composer should do this automatically)

 - Make sure you are on the latest version of node and npm (you could use nvm for this). 

 - run `npm install` in the root folder of module.

 - See the [`examples-from-root-of-project`](https://github.com/sunnysideup/silverstripe-sswebpack_engine_only/blob/master/examples-from-root-of-project) folder for the files you need to create.

 - Expose the dist folder in the public resources folder, using composer, as per usual.

 - Browse to the root folder of this module and use the following commands:

# Usage
```
npm run MY_COMMAND --theme_dir=themes/mytheme`
```
OR
```
npm run MY_COMMAND --theme_dir=vendor/myvendor/mypackage/client`
```
Where MY_COMMAND can be
 - `dev` (debug),
 - `watch` (develop), or
 - `build` (prepare for production).



# Good to know

### required structure

 - Your theme name can be anything.  We use `mytheme` as an example name.  You can also use this webpack on vendor packages.

 - the `init.js` and `style.scss` show you to include JS and CSS from other parts.

 - Add a `themes/mytheme/dist` folder for the final output.

 - Add a `themes/mytheme/my_node_modules/` to include other modules (using a package.json file inside that folder).
   You can also include node modules in `mytheme/src` by adding a `package.json` file, i.e.
   running `npm init -y && npm install` in the `mytheme/src` folder.

### jQuery

- jQuery has been aliased so that you can use jQuery anywhere without importing it.

- jQuery can also be added to the global namespace: `window.jQuery = jquery` (untested).

### Editor File

- There is an option to also include an editor file so that you can add it to your TinyMCE HTML Editor.
  Run the watch / build command you will see the configurations available.
