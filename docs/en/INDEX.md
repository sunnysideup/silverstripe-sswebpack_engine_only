# Base SilverStripe theme with a webpack build system

This webpack install allows you to compile any project / vendor/package

## Installation

 - Install this to your themes folder as `sswebpack_engine_only` (composer should do this automatically)

 - See the `examples` folder for the files you need to create.
   Remove the `.example` extension and add the files in the same structure as the example.  

 - Your theme name can be anything.  We use `mytheme` as an example name.

 - the `init.js` and `style.scss` show you to include JS and CSS from other parts.

 - Add a `themes/mytheme/dist` folder for the final output.

 - Add a `themes/mytheme/my_node_modules/` to include other modules (using a package file inside that folder).
   You can also include node modules in mytheme/app by adding a `package.json` file
   running `npm init -y && npm install`

- jQuery has been aliased so that you can use jQuery anywhere without importing it.

- jQuery is also in the global namespace

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
