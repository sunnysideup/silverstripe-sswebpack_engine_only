# Base SilverStripe theme with a webpack build system

## Installation

 - Install this to your themes folder as `sswebpack_engine_only` (composer should do this automatically)

 - See the `examples` folder for the files you need to create.
   Remove the `.example` extension and add the files in the same structure as the example.  

 - Your theme name can be anything.  We use `mytheme` as an example name.

 - You can access `themes/mytheme` (or any other directories relating to your theme)
   by using `@import '~site/themes/mytheme/sass/{file}'` for sass files and,
   `@import 'site/themes/mytheme/sass/{file}'` for javascript files.
   by default `mytheme_app/src` is the root of all includes.

 - the `init.js` and `style.scss` show you to include JS and CSS from other parts.

 - Add a `themes/mytheme_dist` for the final output.

 - Add a `themes/mytheme_node_modules/` to include other modules (using a package file inside that folder).
   You can also included node modules in mytheme_app by adding a `package.json` file
   running `npm init -y && npm install`

- jQuery has been aliased so that you can use jQuery anywhere without importing it.

- The editor file is included so that you can add it to your TinyMCE HTML Editor.

# Huge THANK YOU to:

Andrew:
https://github.com/AndrewHaine/silverstripe-webpack-theme

Greg:
https://github.com/Greg808

For helping me.
