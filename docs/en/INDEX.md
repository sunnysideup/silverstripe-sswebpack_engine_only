# Base SilverStripe theme with a webpack build system

## Installation

 - Install this to your themes folder as sswebpack_engine_only (composer should do this automatically)
 - Add a `themes/mytheme_mysite` folder with  `themes/mytheme_mysite/src/main.js` as the central file.
 - Use import statements inside this file to add other files -e.g. `import './sass/style.sass'`
 - You can access `themes/sswebpack_base` (or any other directories relating to your theme) by using `@import '~base/sass/{file}'`, however `sswebpack_mysite/src/main.js` remains the root of all includes
 - Add a `themes/sswebpack_dist` for the final output.
 - Add a `themes/sswebpack_node_modules/` to include other modules (using a package file inside that folder)
 - It requires your dev-server to be using the following url: `whatever.com.localhost` and the name of the root folder needs to be `whatever.com`.  We will try to change this!

In theory you can change the name of the theme to something other than `sswebpack`, but we have not tested this.

## Further Notes
jquery.browser is inluded as a dependency as it is no longer included in the latest version of jQuery
we include this because it is required on the ecommerce payment form to ensure auto submit is only done for non IE browsers

# Huge THANK YOU to:

Andrew Haine:
https://github.com/AndrewHaine/silverstripe-webpack-theme
