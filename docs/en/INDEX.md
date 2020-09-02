# Base SilverStripe theme with a webpack build system

This webpack install allows you to compile any project / vendor/package.

## Installation

 - Install this to your themes folder as `sswebpack_engine_only` (composer should do this automatically)

 - See the `examples` folder for the files you need to create.
   Remove the `.example` extension and add the files in the same structure as the example.  

 - Expose the dist folder using composer as per usual.

 - Browse to the root folder of this module and use the following commands:

# Usage
```
npm run MY_COMMAND --themes_dir=themes/mytheme`
```
OR
```
npm run MY_COMMAND --themes_dir=vendor/myvendor/mypackage/client`
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

 - Add a `themes/mytheme/my_node_modules/` to include other modules (using a package file inside that folder).
   You can also include node modules in mytheme/src by adding a `package.json` file, i.e.
   running `npm init -y && npm install`

### jQuery

- jQuery has been aliased so that you can use jQuery anywhere without importing it.

- jQuery is also in the global namespace

### Editor File

- The editor file is included so that you can add it to your TinyMCE HTML Editor.

# THANK YOU to:

Uncle Cheese for introducing us to webpack proper.

Andrew:
https://github.com/AndrewHaine/silverstripe-webpack-theme

Greg:
https://github.com/Greg808

Leo and Nedad:
https://github.com/dvlden/

Thank you for helping me along the way.
